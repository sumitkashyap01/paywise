/**
 * Shared Card container component.
 * Standard class: rounded-xl border border-neutral-200 bg-white p-5
 */

export default function Card({ children, className = '', padding = 'p-5', ...props }) {
  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-white ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
