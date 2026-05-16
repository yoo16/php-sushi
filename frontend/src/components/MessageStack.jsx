export default function MessageStack({ errorMessage, flashMessage, isOrderClosed }) {
  return (
    <section className="mb-2">
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
    </section>
  );
}
