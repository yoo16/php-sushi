import { useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import CheckoutModal from '../components/CheckoutModal';
import MessageStack from '../components/MessageStack';
import OrderSummary from '../components/OrderSummary';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';

export default function OrderingPage({ assetBaseUrl, seat, menu, session, messages, actions }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
              baseUrl={assetBaseUrl}
              loading={menu.isProductsLoading}
              products={menu.products}
              disabled={session.isOrderClosed}
              onSelectProduct={setSelectedProduct}
            />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap gap-3">
              <div className="flex items-center rounded-[28px] border border-slate-200 bg-white px-[18px] py-4">
                <span className="block text-[0.82rem] text-slate-500">座席番号</span>
                <span className="block px-4 font-semibold text-slate-900">{seat.seatNumber}</span>
              </div>
              <div className="flex items-center rounded-[28px] border border-slate-200 bg-white px-[18px] py-4">
                <span className="block text-[0.82rem] text-slate-500">状態</span>
                <span className="block px-4 font-semibold text-slate-900">{session.isOrderClosed ? '会計済み' : '注文受付中'}</span>
              </div>
            </div>

            <OrderSummary
              orders={session.orders}
              total={session.total}
              baseUrl={assetBaseUrl}
              disabled={session.isOrderClosed || session.orders.length === 0}
              loading={session.isBilling}
              onBill={() => setIsCheckoutOpen(true)}
            />
          </div>
        </section>

        <CheckoutModal
          open={isCheckoutOpen}
          orders={session.orders}
          total={session.total}
          loading={session.isBilling}
          baseUrl={assetBaseUrl}
          onClose={() => setIsCheckoutOpen(false)}
          onConfirm={async () => {
            const succeeded = await actions.handleBill();
            if (succeeded) {
              setIsCheckoutOpen(false);
            }
          }}
        />

        <ProductModal
          baseUrl={assetBaseUrl}
          product={selectedProduct}
          loading={session.isSubmittingOrder}
          disabled={session.isOrderClosed}
          onClose={() => setSelectedProduct(null)}
          onConfirm={async (quantity) => {
            const succeeded = await actions.handleAddOrder(selectedProduct, quantity);
            if (succeeded) {
              setSelectedProduct(null);
            }
          }}
        />
      </div>
    </main>
  );
}
