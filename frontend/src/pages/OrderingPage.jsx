import { startTransition, useEffect, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import CheckoutModal from '../components/CheckoutModal';
import MessageStack from '../components/MessageStack';
import OrderSummary from '../components/OrderSummary';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import SeatStatusCards from '../components/SeatStatusCards';
import { useMessages } from '../context/MessagesContext';
import { useOrderSessionContext } from '../context/SessionContext';
import { useServices } from '../context/ServicesContext';
import { useSeat } from '../context/SeatContext';
import useCheckoutAction from '../hooks/useCheckoutAction';
import { playThanksVoice } from '../utils/audio';

const ALL_CATEGORY_ID = 0;

export default function OrderingPage() {
  // SeatProvider
  const seat = useSeat();
  // SessionProvider
  const session = useOrderSessionContext();
  // MessagesProvider
  const messages = useMessages();
  // ServicesProvider
  const services = useServices();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { handleBill } = useCheckoutAction({
    orderService: services.orderService,
    session,
    messages,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const nextCategories = await services.categoryService.loadCategories({
          signal: controller.signal,
        });
        setCategories(nextCategories);
      } catch (error) {
        if (error.name !== 'AbortError') {
          messages.setErrorMessage(error.message);
        }
      }
    }

    loadCategories();

    return () => {
      controller.abort();
    };
  }, [messages, services.categoryService]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      if (session.screen !== 'ordering') {
        return;
      }

      setIsProductsLoading(true);

      try {
        const nextProducts = await services.productService.loadProducts(selectedCategory, {
          signal: controller.signal,
        });
        setProducts(nextProducts);
      } catch (error) {
        if (error.name !== 'AbortError') {
          messages.setErrorMessage(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [messages, selectedCategory, services.productService, session.screen]);

  function openCheckout() {
    setIsCheckoutOpen(true);
  }

  function closeCheckout() {
    setIsCheckoutOpen(false);
  }

  function closeProductModal() {
    setSelectedProduct(null);
  }

  async function handleAddOrder(product, quantity) {
    if (!product) {
      return false;
    }

    messages.setErrorMessage('');

    try {
      await services.orderService.submitOrder(session.visitId, product, quantity);
      const orderData = await services.orderService.loadOrders(session.visitId);
      session.setOrders(orderData.orders);
      session.setTotal(orderData.total);
      playThanksVoice();
      messages.setFlashMessage(`${product.name} を ${quantity} 皿追加しました。`);
      return true;
    } catch (error) {
      messages.setErrorMessage(error.message);
      return false;
    }
  }

  async function handleConfirmCheckout() {
    const succeeded = await handleBill();
    if (succeeded) {
      closeCheckout();
    }
  }

  async function handleConfirmProduct(quantity) {
    const succeeded = await handleAddOrder(selectedProduct, quantity);
    if (succeeded) {
      closeProductModal();
    }
  }

  function handleCategoryChange(categoryId) {
    messages.setErrorMessage('');
    startTransition(() => {
      setSelectedCategory(categoryId);
    });
  }

  return (
    <main className="min-h-screen font-sans text-slate-900">
      <div className="mx-auto w-[min(1240px,calc(100%-24px))] py-6 pb-10 max-sm:w-[min(100%,calc(100%-16px))] max-sm:py-4 max-sm:pb-7">
        <MessageStack
          errorMessage={messages.errorMessage}
          flashMessage={messages.flashMessage}
          isOrderClosed={session.isOrderClosed}
        />

        <section className="grid grid-cols-[minmax(0,1.8fr)_minmax(280px,0.7fr)] gap-[18px] max-[900px]:grid-cols-1">
          <div className="rounded-[28px] border border-slate-200 bg-white p-[22px]">
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={handleCategoryChange}
            />
            <ProductGrid
              loading={isProductsLoading}
              products={products}
              disabled={session.isOrderClosed}
              onSelectProduct={setSelectedProduct}
            />
          </div>

          <div>
            <SeatStatusCards seatNumber={seat.seatNumber} isOrderClosed={session.isOrderClosed} />

            <OrderSummary
              orders={session.orders}
              total={session.total}
              disabled={session.isOrderClosed || session.orders.length === 0}
              onBill={openCheckout}
            />
          </div>
        </section>

        <CheckoutModal
          open={isCheckoutOpen}
          orders={session.orders}
          total={session.total}
          onClose={closeCheckout}
          onConfirm={handleConfirmCheckout}
        />

        <ProductModal
          product={selectedProduct}
          disabled={session.isOrderClosed}
          onClose={closeProductModal}
          onConfirm={handleConfirmProduct}
        />
      </div>
    </main>
  );
}
