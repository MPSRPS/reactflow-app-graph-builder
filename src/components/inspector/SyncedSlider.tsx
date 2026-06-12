import { useCallback, useId } from 'react';
import { cn } from '@/lib/utils';

interface SyncedSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function SyncedSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  label = 'Value',
}: SyncedSliderProps) {
  const inputId = useId();
  const numericId = useId();

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseFloat(e.target.value);
      if (!isNaN(raw)) onChange(Math.max(min, Math.min(max, raw)));
    },
    [onChange, min, max]
  );

  const handleNumeric = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseFloat(e.target.value);
      if (!isNaN(raw)) onChange(Math.max(min, Math.min(max, raw)));
    },
    [onChange, min, max]
  );

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="synced-slider">
      <label htmlFor={inputId} className="synced-slider-label">
        {label}
      </label>
      <div className="synced-slider-row">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSlider}
          className={cn('slider-input')}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          style={
            {
              '--slider-pct': `${percentage}%`,
            } as React.CSSProperties
          }
        />
        <input
          id={numericId}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleNumeric}
          className="numeric-input"
          aria-label={`${label} numeric value`}
        />
      </div>
    </div>
  );
}
