export default function SeatStatusCards({ seatNumber, isOrderClosed }) {
  return (
    <div className="mb-2 flex flex-wrap gap-3">
      <div className="flex items-center rounded-[28px] border border-slate-200 bg-white px-[18px] py-4">
        <span className="block text-[0.82rem] text-slate-500">座席番号</span>
        <span className="block px-4 font-semibold text-slate-900">{seatNumber}</span>
      </div>
      <div className="flex items-center rounded-[28px] border border-slate-200 bg-white px-[18px] py-4">
        <span className="block text-[0.82rem] text-slate-500">状態</span>
        <span className="block px-4 font-semibold text-slate-900">{isOrderClosed ? '会計済み' : '注文受付中'}</span>
      </div>
    </div>
  );
}
