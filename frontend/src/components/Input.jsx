/**
 * Shared Input & Label component.
 */

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  className = '',
  prefix,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-xs font-semibold text-neutral-700"
        >
          {label} {required && <span className="text-neutral-400">*</span>}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-neutral-500">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black ${
            prefix ? 'pl-8' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-neutral-800">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
}
