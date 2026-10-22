/**
 * Strict monochrome status badges for PayWise.
 * Standard rule: No status colors. Use badges with black/neutral borders and clear text labels.
 */

export default function Badge({ variant = 'neutral', children, className = '' }) {
  const variantStyles = {
    // Paid: subtle background, neutral border
    paid: 'border border-neutral-200 bg-neutral-100 text-neutral-700',
    // Due soon: white background, neutral border, black text
    due_soon: 'border border-neutral-300 bg-white text-black',
    // Due today: solid black border, white bg, bold
    due_today: 'border border-black bg-white text-black font-semibold',
    // Overdue: solid black border, subtle gray bg
    overdue: 'border border-black bg-neutral-100 text-black font-semibold',
    // Generic neutral badge
    neutral: 'border border-neutral-200 bg-neutral-50 text-neutral-600',
    // Inverse/Black badge
    black: 'border border-black bg-black text-white font-medium',
  };

  const style = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs tracking-tight ${style} ${className}`}
    >
      {children}
    </span>
  );
}
