import { startTransition, useEffect, useState } from 'react';
import CategoryTabs from './components/CategoryTabs';
import CheckoutCompleteScreen from './components/CheckoutCompleteScreen';
import CheckoutModal from './components/CheckoutModal';
import MessageStack from './components/MessageStack';
import OrderSummary from './components/OrderSummary';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import StartScreen from './components/StartScreen';
import {
  addOrder,
  billVisit,
  fetchCategories,
  fetchOrders,
  fetchProducts,
  fetchSeats,
  fetchVisit,
  joinVisit,
} from './services/api';

const ALL_CATEGORY_ID = 0;

export default function App({ config }) {
  const restoredSession = getStoredOrderSession();
  const [seats, setSeats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isStartingOrder, setIsStartingOrder] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isBilling, setIsBilling] = useState(false);
  const [visitId, setVisitId] = useState(restoredSession.visitId);
  const [visitStatus, setVisitStatus] = useState(config.visitStatus ?? 'seated');
  const [completedTotal, setCompletedTotal] = useState(restoredSession.completedTotal);
  const [screen, setScreen] = useState(restoredSession.screen);
  const [errorMessage, setErrorMessage] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [selectedSeatId, setSelectedSeatId] = useState(() => getInitialSeatId(config));
  const [selectedSeatNumber, setSelectedSeatNumber] = useState(() => getInitialSeatNumber(config));

  const apiBaseUrl = config.apiBaseUrl ?? '/api/';
  const assetBaseUrl = config.assetBaseUrl ?? config.baseUrl ?? '/';
  const topPageUrl = config.topPageUrl ?? config.baseUrl ?? '/';
  const seatId = selectedSeatId;
  const seatNumber = selectedSeatNumber ?? '-';
  const isOrderClosed = visitStatus !== 'seated';

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      try {
        const [categoriesResponse, seatsResponse] = await Promise.all([
          fetchCategories(apiBaseUrl),
          fetchSeats(apiBaseUrl),
        ]);

        if (ignore) {
          return;
        }

        setCategories(categoriesResponse.categories ?? []);
        const nextSeats = seatsResponse.seats ?? [];
        setSeats(nextSeats);

        const matchedSeat = nextSeats.find((seat) => Number(seat.id) === Number(selectedSeatId));
        if (matchedSeat) {
          setSelectedSeatNumber(matchedSeat.number);
        } else if (nextSeats.length === 1) {
          setSelectedSeatId(Number(nextSeats[0].id));
          setSelectedSeatNumber(nextSeats[0].number);
          persistSelectedSeat(nextSeats[0].id, nextSeats[0].number);
        }

        if (restoredSession.visitId > 0) {
          const visitResponse = await fetchVisit(apiBaseUrl, restoredSession.visitId);
          const restoredVisit = visitResponse.visit;

          if (restoredVisit?.status === 'seated') {
            const ordersResponse = await fetchOrders(apiBaseUrl, restoredVisit.id);
            if (ignore) {
              return;
            }

            setVisitId(Number(restoredVisit.id));
            setVisitStatus(restoredVisit.status);
            setOrders(ordersResponse.orders ?? []);
            setTotal(ordersResponse.total ?? 0);
            setScreen('ordering');
          } else if (restoredVisit && ['billed', 'paid'].includes(restoredVisit.status)) {
            if (ignore) {
              return;
            }

            setCompletedTotal(Number(restoredVisit.total_with_tax ?? restoredSession.completedTotal ?? 0));
            setScreen('complete');
          } else {
            clearStoredOrderSession();
          }
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setIsBooting(false);
        }
      }
    }

    bootstrap();

    return () => {
      ignore = true;
    };
  }, [apiBaseUrl, restoredSession.completedTotal, restoredSession.visitId, selectedSeatId]);

  useEffect(() => {
    persistOrderSession({
      visitId,
      screen,
      completedTotal,
    });
  }, [completedTotal, screen, visitId]);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      if (screen !== 'ordering') {
        return;
      }

      setIsProductsLoading(true);

      try {
        const response = await fetchProducts(apiBaseUrl, selectedCategory);
        if (!ignore) {
          setProducts(response.products ?? response.data ?? []);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setIsProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [apiBaseUrl, screen, selectedCategory]);

  const orderCount = orders.reduce((sum, order) => sum + Number(order.quantity ?? 0), 0);

  async function refreshOrders() {
    if (Number(visitId) <= 0) {
      setOrders([]);
      setTotal(0);
      return;
    }

    const ordersResponse = await fetchOrders(apiBaseUrl, visitId);
    setOrders(ordersResponse.orders ?? []);
    setTotal(ordersResponse.total ?? 0);
  }

  async function handleStartOrder() {
    setIsStartingOrder(true);
    setErrorMessage('');
    setFlashMessage('');
    setCompletedTotal(0);

    try {
      const resolvedVisit = await ensureVisitSession(apiBaseUrl, seatId, visitId);
      if (!resolvedVisit) {
        throw new Error('有効な注文セッションを開始できませんでした。');
      }

      const ordersResponse = await fetchOrders(apiBaseUrl, resolvedVisit.id);
      setVisitId(Number(resolvedVisit.id));
      setVisitStatus(resolvedVisit.status ?? 'seated');
      setOrders(ordersResponse.orders ?? []);
      setTotal(ordersResponse.total ?? 0);
      setSelectedCategory(ALL_CATEGORY_ID);
      setScreen('ordering');
      setCompletedTotal(0);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsStartingOrder(false);
    }
  }

  function handleSeatChange(nextSeatId) {
    const seat = seats.find((item) => Number(item.id) === Number(nextSeatId));
    const nextSeatNumber = seat?.number ?? '-';
    setSelectedSeatId(nextSeatId);
    setSelectedSeatNumber(nextSeatNumber);
    persistSelectedSeat(nextSeatId, nextSeatNumber);
    setErrorMessage('');
  }

  function handleCategoryChange(categoryId) {
    setErrorMessage('');
    startTransition(() => {
      setSelectedCategory(categoryId);
    });
  }

  async function handleAddOrder(quantity) {
    if (!selectedProduct) {
      return;
    }

    setIsSubmittingOrder(true);
    setErrorMessage('');

    try {
      await addOrder(apiBaseUrl, {
        product_id: Number(selectedProduct.id),
        product_name: selectedProduct.name,
        product_image_path: selectedProduct.image_path,
        quantity,
        visit_id: visitId,
      });
      await refreshOrders();
      playThanksVoice();
      setFlashMessage(`${selectedProduct.name} を ${quantity} 皿追加しました。`);
      setSelectedProduct(null);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  async function handleBill() {
    setIsBilling(true);
    setErrorMessage('');

    try {
      const response = await billVisit(apiBaseUrl, visitId);
      const billedTotal = Number(response.total ?? total ?? 0);
      setCompletedTotal(billedTotal);
      setFlashMessage('');
      transitionToCompleteScreen();
      return true;
    } catch (error) {
      setErrorMessage(error.message);
      return false;
    } finally {
      setIsBilling(false);
    }
  }

  function transitionToCompleteScreen() {
    setVisitId(0);
    setVisitStatus('seated');
    setOrders([]);
    setTotal(0);
    setSelectedProduct(null);
    setSelectedCategory(ALL_CATEGORY_ID);
    setIsCheckoutOpen(false);
    setScreen('complete');
  }

  if (isBooting) {
    return;
  }

  if (screen === 'start') {
    return (
      <>
        <MessageStack
          errorMessage={errorMessage}
          flashMessage={flashMessage}
          isOrderClosed={false}
        />
        <StartScreen
          seatId={seatId}
          seats={seats}
          loading={isStartingOrder}
          onSeatChange={handleSeatChange}
          onStart={handleStartOrder}
        />
      </>
    );
  }

  if (screen === 'complete') {
    return (
      <CheckoutCompleteScreen
        seatNumber={seatNumber}
        total={completedTotal}
        topPageUrl={topPageUrl}
      />
    );
  }

  return (
    <main className="min-h-screen font-sans text-slate-900">
      <div className="mx-auto w-[min(1240px,calc(100%-24px))] py-6 pb-10 max-sm:w-[min(100%,calc(100%-16px))] max-sm:py-4 max-sm:pb-7">
        <MessageStack
          errorMessage={errorMessage}
          flashMessage={flashMessage}
          isOrderClosed={isOrderClosed}
        />

        <section className="grid grid-cols-[minmax(0,1.8fr)_minmax(280px,0.7fr)] gap-[18px] max-[900px]:grid-cols-1">
          <div className="rounded-[28px] border border-slate-200 bg-white p-[22px]">
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={handleCategoryChange}
            />
            <ProductGrid
              baseUrl={assetBaseUrl}
              loading={isProductsLoading}
              products={products}
              disabled={isOrderClosed}
              onSelectProduct={setSelectedProduct}
            />
          </div>

          <div>
            <div className="flex mb-2 flex-wrap gap-3">
              <div className="flex items-center rounded-[28px] border border-slate-200 bg-white px-[18px] py-4">
                <span className="block text-[0.82rem] text-slate-500">座席番号</span>
                <span className="block px-4 font-semibold text-slate-900">{seatNumber}</span>
              </div>
              <div className="flex items-center rounded-[28px] border border-slate-200 bg-white px-[18px] py-4">
                <span className="block text-[0.82rem] text-slate-500">状態</span>
                <span className="block px-4 font-semibold text-slate-900">{isOrderClosed ? '会計済み' : '注文受付中'}</span>
              </div>
            </div>

            <OrderSummary
              orders={orders}
              total={total}
              baseUrl={assetBaseUrl}
              disabled={isOrderClosed || orders.length === 0}
              loading={isBilling}
              onBill={() => setIsCheckoutOpen(true)}
            />
          </div>
        </section>

        <CheckoutModal
          open={isCheckoutOpen}
          orders={orders}
          total={total}
          loading={isBilling}
          baseUrl={assetBaseUrl}
          onClose={() => setIsCheckoutOpen(false)}
          onConfirm={async () => {
            const succeeded = await handleBill();
            if (succeeded) {
              setIsCheckoutOpen(false);
            }
          }}
        />

        <ProductModal
          baseUrl={assetBaseUrl}
          product={selectedProduct}
          loading={isSubmittingOrder}
          disabled={isOrderClosed}
          onClose={() => setSelectedProduct(null)}
          onConfirm={handleAddOrder}
        />
      </div>
    </main>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

async function ensureVisitSession(apiBaseUrl, seatId, currentVisitId) {
  if (Number(currentVisitId) > 0) {
    const visitResponse = await fetchVisit(apiBaseUrl, currentVisitId);
    if (visitResponse.status === 'success' && visitResponse.visit) {
      return visitResponse.visit;
    }
  }

  if (Number(seatId) <= 0) {
    return null;
  }

  const joinResponse = await joinVisit(apiBaseUrl, seatId);
  if (joinResponse.status !== 'success' || !joinResponse.visit) {
    return null;
  }

  if (typeof joinResponse.visit === 'object') {
    return joinResponse.visit;
  }

  const resolvedVisitResponse = await fetchVisit(apiBaseUrl, joinResponse.visit);
  if (resolvedVisitResponse.status === 'success' && resolvedVisitResponse.visit) {
    return resolvedVisitResponse.visit;
  }

  return null;
}

function playThanksVoice() {
  const voiceFiles = [
    '/audio/voice-thanks-1.mp3',
    '/audio/voice-thanks-2.mp3',
    '/audio/voice-thanks-3.mp3',
    '/audio/voice-thanks-4.mp3',
    '/audio/voice-thanks-5.mp3',
  ];
  const selectedFile = voiceFiles[Math.floor(Math.random() * voiceFiles.length)];
  const audio = new Audio(selectedFile);

  audio.play().catch(() => {
    // Ignore autoplay failures; the order itself already succeeded.
  });
}

function getInitialSeatId(config) {
  if (typeof window === 'undefined') {
    return Number(config.seatId ?? 0);
  }

  const storedSeatId = Number(window.localStorage.getItem('selectedSeatId') ?? 0);
  return storedSeatId > 0 ? storedSeatId : Number(config.seatId ?? 0);
}

function getInitialSeatNumber(config) {
  if (typeof window === 'undefined') {
    return config.seatNumber ?? '-';
  }

  return window.localStorage.getItem('selectedSeatNumber') ?? config.seatNumber ?? '-';
}

function persistSelectedSeat(seatId, seatNumber) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('selectedSeatId', String(seatId));
  window.localStorage.setItem('selectedSeatNumber', String(seatNumber));
}

function getStoredOrderSession() {
  if (typeof window === 'undefined') {
    return {
      visitId: 0,
      screen: 'start',
      completedTotal: 0,
    };
  }

  return {
    visitId: Number(window.localStorage.getItem('activeVisitId') ?? 0),
    screen: window.localStorage.getItem('orderScreen') ?? 'start',
    completedTotal: Number(window.localStorage.getItem('completedTotal') ?? 0),
  };
}

function persistOrderSession({ visitId, screen, completedTotal }) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('activeVisitId', String(visitId ?? 0));
  window.localStorage.setItem('orderScreen', String(screen ?? 'start'));
  window.localStorage.setItem('completedTotal', String(completedTotal ?? 0));
}

function clearStoredOrderSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem('activeVisitId');
  window.localStorage.removeItem('orderScreen');
  window.localStorage.removeItem('completedTotal');
}
