/**
 * Shared Button component adhering to PayWise monochrome design tokens.
 * Variants: primary, secondary, destructive (neutral outline, NO red), ghost.
 */

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-40 cursor-pointer';

  const sizeStyles = {
    sm: 'rounded-md px-3 py-1.5 text-xs',
    md: 'rounded-lg px-4 py-2 text-sm',
    lg: 'rounded-lg px-5 py-2.5 text-sm',
  };

  const variantStyles = {
    // Primary: black background, white text
    primary: 'bg-black text-white hover:bg-neutral-800 active:bg-neutral-900',
    // Secondary: white background, neutral border, black text
    secondary: 'border border-neutral-300 bg-white text-black hover:bg-neutral-100',
    // Destructive: Neutral outlined style with clear action label and confirmation (NO red)
    destructive:
      'border border-neutral-300 bg-white text-neutral-800 hover:border-black hover:bg-neutral-100 hover:text-black',
    // Ghost: transparent background
    ghost: 'text-neutral-700 hover:bg-neutral-100 hover:text-black',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
    variantStyles[variant] || variantStyles.primary
  } ${className}`;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
