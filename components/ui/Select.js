'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function normalizeOptions(options) {
  return options.map((opt) =>
    typeof opt === 'object' && opt !== null
      ? { value: String(opt.value), label: opt.label }
      : { value: String(opt), label: String(opt) }
  );
}

export default function Select({
  value,
  onChange,
  options = [],
  placeholder = 'Select',
  className,
  buttonClassName,
  disabled = false,
  'aria-label': ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const items = normalizeOptions(options);
  const selected = items.find((item) => item.value === String(value));

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={cn(
          'flex w-full min-w-0 items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800',
          'hover:border-gray-400',
          open && 'border-brand-primary ring-2 ring-brand-primary/20',
          disabled && 'cursor-not-allowed opacity-50',
          buttonClassName
        )}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-gray-600 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white py-1 shadow-lg"
        >
          {items.map((item) => {
            const active = item.value === String(value);
            return (
              <li key={item.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm',
                    active ? 'bg-brand-primary text-white' : 'text-gray-800 hover:bg-gray-100'
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
