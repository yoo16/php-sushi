import OrderItemCard from './OrderItemCard';

export default function OrderItemList({ baseUrl, orders }) {
  return (
    <div className="my-[18px] flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
      {orders.length ? (
        orders.map((order) => <OrderItemCard key={order.id} baseUrl={baseUrl} order={order} />)
      ) : (
        <div className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-slate-300 bg-white/70 text-slate-500">
          まだ注文はありません。
        </div>
      )}
    </div>
  );
}
