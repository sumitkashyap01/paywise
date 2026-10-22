import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';

const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Salary / Income',
  'Other',
];

const PAYMENT_METHODS = [
  'UPI',
  'Cash',
  'Debit Card',
  'Credit Card',
  'Net Banking',
];

const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Form({
  isOpen = true,
  onClose,
  initialData = null,
  onSuccess,
  onDelete,
}) {
  const { addTransaction, updateTransaction, deleteTransaction } = useFinance();

  const isEditing = Boolean(initialData && initialData.id);

  const [title, setTitle] = useState(() => initialData?.title || '');
  const [amount, setAmount] = useState(() =>
    initialData?.amount !== undefined ? String(initialData.amount) : ''
  );
  const [type, setType] = useState(() => initialData?.type || 'expense');
  const [category, setCategory] = useState(
    () => initialData?.category || CATEGORIES[0]
  );
  const [paymentMethod, setPaymentMethod] = useState(
    () => initialData?.paymentMethod || PAYMENT_METHODS[0]
  );
  const [date, setDate] = useState(() =>
    initialData?.date ? initialData.date.split('T')[0] : getTodayDate()
  );
  const [note, setNote] = useState(() => initialData?.note || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close dialog on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
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
      type,
      category,
      paymentMethod,
      date,
      note: note.trim(),
    };

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateTransaction(initialData.id, payload);
      } else {
        await addTransaction(payload);
      }

      if (onSuccess) {
        onSuccess(payload);
      }
      if (onClose) {
        onClose();
      }
    } catch {
      setErrorMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !initialData?.id) return;

    const confirmed = window.confirm(
      `Delete "${initialData.title || 'this transaction'}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await deleteTransaction(initialData.id);
      if (onDelete) {
        onDelete(initialData.id);
      }
      if (onClose) {
        onClose();
      }
    } catch {
      setErrorMessage('Failed to delete transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-xl border border-neutral-300 bg-white p-6 shadow-2xl">
        {/* Dialog Header */}
        <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <h2 id="dialog-title" className="text-lg font-bold tracking-tight text-black">
              {isEditing ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-xs text-neutral-500">
              {isEditing
                ? 'Update or remove this transaction record'
                : 'Enter details for the new expense or income'}
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

          {/* Type Segmented Control */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-700">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  type === 'expense'
                    ? 'bg-black text-white'
                    : 'border border-neutral-300 bg-white text-black hover:bg-neutral-100'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  type === 'income'
                    ? 'bg-black text-white'
                    : 'border border-neutral-300 bg-white text-black hover:bg-neutral-100'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Title and Amount (Grid) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="tx-title" className="mb-1 block text-xs font-semibold text-neutral-700">
                Title <span className="text-neutral-400">*</span>
              </label>
              <input
                id="tx-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grocery store, Uber"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="tx-amount" className="mb-1 block text-xs font-semibold text-neutral-700">
                Amount (₹) <span className="text-neutral-400">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-neutral-500">
                  ₹
                </span>
                <input
                  id="tx-amount"
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
          </div>

          {/* Category and Payment Method (Grid) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="tx-category" className="mb-1 block text-xs font-semibold text-neutral-700">
                Category
              </label>
              <select
                id="tx-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tx-payment-method" className="mb-1 block text-xs font-semibold text-neutral-700">
                Payment Method
              </label>
              <select
                id="tx-payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label htmlFor="tx-date" className="mb-1 block text-xs font-semibold text-neutral-700">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Optional Note */}
          <div>
            <label htmlFor="tx-note" className="mb-1 block text-xs font-semibold text-neutral-700">
              Note / Memo <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <input
              id="tx-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional details..."
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Dialog Action Buttons */}
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
                  : 'Add Transaction'}
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

            {/* Delete Option for Edit Mode */}
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
