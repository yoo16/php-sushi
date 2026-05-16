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
      <main className="menu-shell menu-shell-loading">
        <section className="page-card loading-card">
          <p className="section-eyebrow">Seat {seatNumber}</p>
          <h1>注文画面を準備しています</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="menu-shell">
      <header className="page-header">
        <div className="brand-block">
          <p className="brand-kicker">Haru Sushi</p>
          <h1>ご注文</h1>
          <p className="brand-copy">カテゴリを選んで、食べたいお皿をそのまま注文できます。</p>
        </div>
        <div className="header-side">
          <div className="seat-chip">
            <span>座席番号</span>
            <strong>{seatNumber}</strong>
          </div>
          <div className="status-chip">
            <span>状態</span>
            <strong>{isOrderClosed ? '会計済み' : '注文受付中'}</strong>
          </div>
        </div>
      </header>

      <section className="dashboard-strip">
        <article className="stat-card">
          <span>注文数</span>
          <strong>{orderCount}</strong>
        </article>
        <article className="stat-card">
          <span>合計</span>
          <strong>{formatPrice(total)}</strong>
        </article>
      </section>

      {errorMessage ? <p className="notice notice-error">{errorMessage}</p> : null}
      {flashMessage ? <p className="notice notice-success">{flashMessage}</p> : null}
      {isOrderClosed ? (
        <p className="notice notice-muted">この注文セッションは会計済みです。新しい注文は追加できません。</p>
      ) : null}

      <section className="menu-layout">
        <div className="menu-main page-card">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Category</p>
              <h2>カテゴリから選ぶ</h2>
            </div>
          </div>
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

        <OrderSummary
          orders={orders}
          total={total}
          baseUrl={assetBaseUrl}
          disabled={isOrderClosed || orders.length === 0}
          loading={isBilling}
          onBill={() => setIsCheckoutOpen(true)}
        />
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
