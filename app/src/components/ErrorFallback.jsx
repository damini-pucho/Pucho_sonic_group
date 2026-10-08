import { AlertTriangle } from 'lucide-react';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="card border-intent-danger-border bg-intent-danger-bg flex flex-col items-center justify-center text-center p-8 min-h-[200px]">
      <AlertTriangle className="w-8 h-8 text-intent-danger-text mb-3" strokeWidth={1.5} />
      <h3 className="text-sm font-semibold text-intent-danger-text">Something went wrong</h3>
      <p className="text-xs text-intent-danger-text/70 mt-1 mb-4 max-w-[250px] truncate">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button onClick={resetErrorBoundary} className="btn-secondary text-intent-danger-text text-xs">
        Try again
      </button>
    </div>
  );
}
