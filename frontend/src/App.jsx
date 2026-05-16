import { startTransition, useEffect, useState } from 'react';
import CategoryTabs from './components/CategoryTabs';
import CheckoutModal from './components/CheckoutModal';
import OrderSummary from './components/OrderSummary';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import {
  addOrder,
  billVisit,
  fetchCategories,
  fetchOrders,
  fetchProducts,
  fetchVisit,
  joinVisit,
} from './services/api';

const ALL_CATEGORY_ID = 0;

export default function App({ config }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isBilling, setIsBilling] = useState(false);
  const [visitId, setVisitId] = useState(Number(config.visitId ?? 0));
  const [visitStatus, setVisitStatus] = useState(config.visitStatus ?? 'seated');
  const [errorMessage, setErrorMessage] = useState('');
  const [flashMessage, setFlashMessage] = useState('');

  const apiBaseUrl = config.apiBaseUrl ?? '/api/';
  const assetBaseUrl = config.assetBaseUrl ?? config.baseUrl ?? '/';
  const seatId = Number(config.seatId ?? 0);
  const seatNumber = config.seatNumber ?? '-';
  const isOrderClosed = visitStatus !== 'seated';

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      try {
        const resolvedVisit = await ensureVisitSession(apiBaseUrl, seatId, visitId);
        if (!resolvedVisit) {
          throw new Error('有効な注文セッションを開始できませんでした。');
        }

        const [categoriesResponse, ordersResponse] = await Promise.all([
          fetchCategories(apiBaseUrl),
          fetchOrders(apiBaseUrl, resolvedVisit.id),
        ]);

        if (ignore) {
          return;
        }

        setVisitId(Number(resolvedVisit.id));
        setVisitStatus(resolvedVisit.status ?? 'seated');
        setCategories(categoriesResponse.categories ?? []);
        setOrders(ordersResponse.orders ?? []);
        setTotal(ordersResponse.total ?? 0);
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
  }, [apiBaseUrl, seatId]);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
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
  }, [apiBaseUrl, selectedCategory]);

  const orderCount = orders.reduce((sum, order) => sum + Number(order.quantity ?? 0), 0);

  async function refreshOrders() {
    const ordersResponse = await fetchOrders(apiBaseUrl, visitId);
    setOrders(ordersResponse.orders ?? []);
    setTotal(ordersResponse.total ?? 0);
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
      setVisitStatus('billed');
      setFlashMessage(`会計を確定しました。合計 ${formatPrice(response.total ?? total)} です。`);
      await refreshOrders();
      return true;
    } catch (error) {
      setErrorMessage(error.message);
      return false;
    } finally {
      setIsBilling(false);
    }
  }

  if (isBooting) {
    return (
      <main className="mx-auto grid min-h-screen w-[min(1240px,calc(100%-24px))] items-center py-6 pb-10 font-sans max-sm:w-[min(100%,calc(100%-16px))] max-sm:py-4 max-sm:pb-7">
        <section className="rounded-[28px] border border-slate-200 bg-white p-[22px] shadow-[0_24px_60px_rgba(32,76,112,0.12)]">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-sky-700">Seat {seatNumber}</p>
          <h1 className="mt-1.5 text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[0.95] text-slate-900">注文画面を準備しています</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-sans text-slate-900">
      <div className="mx-auto w-[min(1240px,calc(100%-24px))] py-6 pb-10 max-sm:w-[min(100%,calc(100%-16px))] max-sm:py-4 max-sm:pb-7">


        {errorMessage ? (
          <p className="mt-4 rounded-[18px] bg-rose-100 px-[18px] py-[14px] text-[0.95rem] text-rose-700">{errorMessage}</p>
        ) : null}
        {flashMessage ? (
          <p className="mt-4 rounded-[18px] bg-emerald-100 px-[18px] py-[14px] text-[0.95rem] text-emerald-700">{flashMessage}</p>
        ) : null}
        {isOrderClosed ? (
          <p className="mt-4 rounded-[18px] bg-slate-100 px-[18px] py-[14px] text-[0.95rem] text-slate-600">
            この注文セッションは会計済みです。新しい注文は追加できません。
          </p>
        ) : null}

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
                <span className="block px-4 text-lg font-semibold text-slate-900">{seatNumber}</span>
              </div>
              <div className="flex items-center rounded-[28px] border border-slate-200 bg-white px-[18px] py-4">
                <span className="block text-[0.82rem] text-slate-500">状態</span>
                <span className="block px-4 text-lg font-semibold text-slate-900">{isOrderClosed ? '会計済み' : '注文受付中'}</span>
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
