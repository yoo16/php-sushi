export default function SeatSelect({ onSeatChange, seatId, seats }) {
  return (
    <div className="mt-4 flex justify-center">
      <label className="w-full max-w-xs text-left">
        <span className="mb-2 block text-sm text-slate-500">座席を選択</span>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
          value={seatId}
          onChange={(event) => onSeatChange(Number(event.target.value))}
        >
          <option value={0}>座席を選択してください</option>
          {seats.map((seat) => (
            <option key={seat.id} value={seat.id}>
              席番号 {seat.number}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
