import CategoryTabs from './components/CategoryTabs';
import CheckoutCompleteScreen from './components/CheckoutCompleteScreen';
import CheckoutModal from './components/CheckoutModal';
import MessageStack from './components/MessageStack';
import OrderSummary from './components/OrderSummary';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import StartScreen from './components/StartScreen';
import useOrderAppState from './hooks/useOrderAppState';
import useOrderBootstrap from './hooks/useOrderBootstrap';
import useOrderFlow from './hooks/useOrderFlow';
import useProductCatalog from './hooks/useProductCatalog';
import useSeatSelection from './hooks/useSeatSelection';

export default function App({ config }) {
  const {
    restoredSession,
    seats,
    setSeats,
    categories,
    setCategories,
    products,
    setProducts,
    orders,
    setOrders,
    total,
    setTotal,
    selectedCategory,
    setSelectedCategory,
    selectedProduct,
    setSelectedProduct,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isBooting,
    setIsBooting,
    isStartingOrder,
    setIsStartingOrder,
    isProductsLoading,
    setIsProductsLoading,
    isSubmittingOrder,
    setIsSubmittingOrder,
    isBilling,
    setIsBilling,
    visitId,
    setVisitId,
    visitStatus,
    setVisitStatus,
    completedTotal,
    setCompletedTotal,
    screen,
    setScreen,
    errorMessage,
    setErrorMessage,
    flashMessage,
    setFlashMessage,
    selectedSeatId,
    setSelectedSeatId,
    setSelectedSeatNumber,
    seatId,
    seatNumber,
    isOrderClosed,
    orderCount,
  } = useOrderAppState(config);

  const apiBaseUrl = config.apiBaseUrl ?? '/api/';
  const assetBaseUrl = config.assetBaseUrl ?? config.baseUrl ?? '/';

  useOrderBootstrap({
    apiBaseUrl,
    restoredSession,
    selectedSeatId,
    setCategories,
    setSeats,
    setSelectedSeatId,
    setSelectedSeatNumber,
    setVisitId,
    setVisitStatus,
    setOrders,
    setTotal,
    setScreen,
    setCompletedTotal,
    setErrorMessage,
    setIsBooting,
    visitId,
    screen,
    completedTotal,
  });

  const { handleSeatChange } = useSeatSelection({
    seats,
    setSelectedSeatId,
    setSelectedSeatNumber,
    setErrorMessage,
  });

  const { handleCategoryChange } = useProductCatalog({
    apiBaseUrl,
    screen,
    selectedCategory,
    setProducts,
    setIsProductsLoading,
    setErrorMessage,
    setSelectedCategory,
  });

  const { handleStartOrder, handleAddOrder, handleBill, returnToTopScreen } = useOrderFlow({
    apiBaseUrl,
    seatId,
    visitId,
    total,
    selectedProduct,
    setVisitId,
    setVisitStatus,
    setOrders,
    setTotal,
    setSelectedCategory,
    setScreen,
    setCompletedTotal,
    setErrorMessage,
    setFlashMessage,
    setIsStartingOrder,
    setIsSubmittingOrder,
    setIsBilling,
    setIsCheckoutOpen,
    setSelectedProduct,
  });

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
        onBackToTop={returnToTopScreen}
        seatNumber={seatNumber}
        total={completedTotal}
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
