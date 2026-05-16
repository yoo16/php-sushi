import { useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import CheckoutModal from '../components/CheckoutModal';
import MessageStack from '../components/MessageStack';
import OrderSummary from '../components/OrderSummary';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import SeatStatusCards from '../components/SeatStatusCards';
import { useOrderApp } from '../context/OrderAppContext';

export default function OrderingPage() {
  const { seat, menu, session, messages, actions } = useOrderApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function openCheckout() {
    setIsCheckoutOpen(true);
  }

  function closeCheckout() {
    setIsCheckoutOpen(false);
  }

  function closeProductModal() {
    setSelectedProduct(null);
  }

  async function handleConfirmCheckout() {
    const succeeded = await actions.handleBill();
    if (succeeded) {
      closeCheckout();
    }
  }

  async function handleConfirmProduct(quantity) {
    const succeeded = await actions.handleAddOrder(selectedProduct, quantity);
    if (succeeded) {
      closeProductModal();
    }
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
              categories={menu.categories}
              selectedCategory={menu.selectedCategory}
              onChange={menu.handleCategoryChange}
            />
            <ProductGrid
              loading={menu.isProductsLoading}
              products={menu.products}
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
