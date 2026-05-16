export default function LoadingButton({
  type = 'button',
  className = '',
  disabled = false,
  children,
  onClick,
}) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="inline-flex items-center justify-center gap-2">
        <span>{children}</span>
      </span>
    </button>
  );
}
