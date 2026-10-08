export default function LoadingSpinner({ tip = 'Loading...', size = 'default' }) {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    default: 'h-10 w-10 border-2',
    large: 'h-14 w-14 border-[3px]',
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div
        className={`animate-spin rounded-full border-primary-200 border-t-primary-500 ${sizeClasses[size] || sizeClasses.default}`}
      />
      {tip && <p className="text-xs text-text-tertiary">{tip}</p>}
    </div>
  );
}
