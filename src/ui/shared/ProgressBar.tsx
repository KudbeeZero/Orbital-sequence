/**
 * ProgressBar - Colored progress indicator with optional label.
 * Used for health, shield, oxygen, ammo, and loading bars.
 */

interface ProgressBarProps {
  value: number;       // 0-100
  max?: number;        // defaults to 100
  color?: 'cyan' | 'green' | 'red' | 'yellow' | 'blue' | 'purple';
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorMap = {
  cyan: 'bg-cyan-primary',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
};

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  color = 'cyan',
  label,
  showValue = false,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between mb-0.5 text-xs">
          {label && <span className="text-gray-300 uppercase tracking-wide">{label}</span>}
          {showValue && <span className="text-cyan-primary">{Math.round(value)}/{max}</span>}
        </div>
      )}
      <div className={`w-full bg-white/10 overflow-hidden ${sizeMap[size]}`}>
        <div
          className={`h-full ${colorMap[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
