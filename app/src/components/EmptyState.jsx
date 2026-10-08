import { cn } from '../utils/cn';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-10 text-center rounded-xl border border-dashed border-black/[0.12]', className)}>
      <div className="w-12 h-12 bg-black/[0.04] rounded-full flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-ink-3" strokeWidth={1.5} />
      </div>
      <h3 className="text-[15px] font-semibold text-ink mb-1">{title}</h3>
      {description && <p className="text-[13px] text-ink-3 max-w-sm">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary mt-4">
          {action.label}
        </button>
      )}
    </div>
  );
}
