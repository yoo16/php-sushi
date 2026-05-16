export default function LoadingModal({ message }) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-sky-50/75 p-5 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col items-center rounded-[28px] border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_32px_90px_rgba(20,56,83,0.18)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />
        <p className="mt-5 text-base font-medium text-slate-700">{message}</p>
      </div>
    </div>
  );
}
