import { useState, useEffect } from 'react';
import { useFinance } from '../../context/useFinance';
import { getTodayInputDate } from '../../utils/dates';

const CATEGORIES = [
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Software & Apps',
  'Housing & Rent',
  'Finance & EMIs',
  'Education',
  'Other',
];

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
];

const PAYMENT_METHODS = ['UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Auto-Debit'];

export default function RecurringModal({
  isOpen,
  onClose,
  initialData = null,
}) {
  const { addRecurringPayment, updateRecurringPayment, deleteRecurringPayment } = useFinance();

  const isEditing = Boolean(initialData && initialData.id);

  const [title, setTitle] = useState(() => initialData?.title || '');
  const [amount, setAmount] = useState(() =>
    initialData?.amount !== undefined ? String(initialData.amount) : ''
  );
  const [frequency, setFrequency] = useState(() => initialData?.frequency || 'monthly');
  const [category, setCategory] = useState(() => initialData?.category || CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState(
    () => initialData?.paymentMethod || PAYMENT_METHODS[0]
  );
  const [nextDueDate, setNextDueDate] = useState(() =>
    initialData?.nextDueDate ? initialData.nextDueDate.split('T')[0] : getTodayInputDate()
  );
  const [autoPay, setAutoPay] = useState(() => Boolean(initialData?.autoPay));
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedTitle = title.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedTitle) {
      setErrorMessage('Title is required.');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter an amount greater than ₹0.');
      return;
    }

    const payload = {
      title: trimmedTitle,
      amount: parsedAmount,
      frequency,
      category,
      paymentMethod,
      nextDueDate,
      autoPay,
    };

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateRecurringPayment(initialData.id, payload);
      } else {
        await addRecurringPayment(payload);
      }
      onClose();
    } catch {
      setErrorMessage('Failed to save recurring payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !initialData?.id) return;

    const confirmed = window.confirm(
      `Delete "${initialData.title || 'this recurring payment'}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await deleteRecurringPayment(initialData.id);
      onClose();
    } catch {
      setErrorMessage('Failed to delete item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-xl border border-neutral-300 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-black">
              {isEditing ? 'Edit Recurring Payment' : 'New Recurring Payment'}
            </h2>
            <p className="text-xs text-neutral-500">
              {isEditing
                ? 'Update commitment details or schedule'
                : 'Track subscriptions, bills, and loan EMIs'}
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:border-black hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="rounded-lg border border-neutral-300 bg-neutral-100 p-2.5 text-xs text-neutral-800">
              {errorMessage}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="rec-title" className="mb-1 block text-xs font-semibold text-neutral-700">
              Payment Title / Provider <span className="text-neutral-400">*</span>
            </label>
            <input
              id="rec-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Netflix, Car EMI, Electricity Bill"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Amount and Frequency (Grid) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="rec-amount" className="mb-1 block text-xs font-semibold text-neutral-700">
                Amount (₹) <span className="text-neutral-400">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-neutral-500">
                  ₹
                </span>
                <input
                  id="rec-amount"
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-neutral-300 bg-white py-2 pr-3 pl-8 text-sm tabular-nums text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="rec-frequency" className="mb-1 block text-xs font-semibold text-neutral-700">
                Billing Cycle
              </label>
              <select
                id="rec-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Payment Method (Grid) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="rec-category" className="mb-1 block text-xs font-semibold text-neutral-700">
                Category
              </label>
              <select
                id="rec-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rec-method" className="mb-1 block text-xs font-semibold text-neutral-700">
                Payment Method
              </label>
              <select
                id="rec-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Next Due Date & Auto-Pay */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 items-center">
            <div>
              <label htmlFor="rec-due" className="mb-1 block text-xs font-semibold text-neutral-700">
                Next Due Date
              </label>
              <input
                id="rec-due"
                type="date"
                required
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="pt-4 sm:pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPay}
                  onChange={(e) => setAutoPay(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 accent-black text-black"
                />
                <span className="text-xs font-medium text-neutral-700">
                  Auto-debit configured
                </span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-300"
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditing
                  ? 'Save Changes'
                  : 'Add Commitment'}
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-100"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-black hover:bg-neutral-100 hover:text-black"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
