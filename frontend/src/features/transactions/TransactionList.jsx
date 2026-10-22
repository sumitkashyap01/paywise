import { useState } from 'react';
import { useFinance } from '../../context/useFinance';
import { formatDate } from '../../utils/dates';
import { formatINR } from '../../utils/calculations';

export default function TransactionList({ onOpenAdd, onSelectEdit }) {
  const { transactions } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all'); // all, expense, income
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc

  // Categories list derived from current transactions + defaults
  const categories = [
    'All',
    ...Array.from(new Set(transactions.map((t) => t.category).filter(Boolean))),
  ];

  // Filtering
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.paymentMethod?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || t.category === selectedCategory;

    const matchesType =
      selectedType === 'all' || t.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-asc') {
      return new Date(a.date || 0) - new Date(b.date || 0);
    }
    if (sortBy === 'amount-desc') {
      return (Number(b.amount) || 0) - (Number(a.amount) || 0);
    }
    // date-desc default
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  // Filtered Totals
  const filteredExpenses = sorted
    .filter((t) => t.type !== 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const filteredIncome = sorted
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards for Transaction Filter Context */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500">Filtered Expenses</p>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl text-black">
            {formatINR(filteredExpenses)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {sorted.filter((t) => t.type !== 'income').length} expense records
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500">Filtered Income</p>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl text-black">
            {formatINR(filteredIncome)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            {sorted.filter((t) => t.type === 'income').length} income records
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500">Net Balance</p>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl text-black">
            {formatINR(filteredIncome - filteredExpenses)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            Total {sorted.length} matching entries
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
        {/* Header and Controls */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-black">
              All Transactions ({transactions.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Filter, search, or click any record to edit details
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAdd}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
          >
            + Add Transaction
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-12">
          {/* Search */}
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="Search by title, note, method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-3 flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`flex-1 rounded-md py-1 font-medium text-center transition-colors ${
                selectedType === 'all'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('expense')}
              className={`flex-1 rounded-md py-1 font-medium text-center transition-colors ${
                selectedType === 'expense'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('income')}
              className={`flex-1 rounded-md py-1 font-medium text-center transition-colors ${
                selectedType === 'income'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Income
            </button>
          </div>

          {/* Sort selector */}
          <div className="sm:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="date-desc">Date (Newest first)</option>
              <option value="date-asc">Date (Oldest first)</option>
              <option value="amount-desc">Amount (Highest first)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-1.5 border-b border-neutral-200 pb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'border border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Transaction Table / List */}
        {sorted.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-10 text-center">
            <p className="text-sm font-semibold text-neutral-800">
              No transactions match your criteria
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200">
            {sorted.map((tx) => (
              <div
                key={tx.id}
                onClick={() => onSelectEdit(tx)}
                className="flex cursor-pointer items-center justify-between p-3.5 transition-colors hover:bg-neutral-50"
              >
                <div className="min-w-0 pr-3">
                  <p className="truncate text-sm font-semibold text-black">
                    {tx.title}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span>{tx.category || 'General'}</span>
                    <span>•</span>
                    <span>{formatDate(tx.date)}</span>
                    {tx.paymentMethod && (
                      <>
                        <span>•</span>
                        <span>{tx.paymentMethod}</span>
                      </>
                    )}
                    <span className="rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.2 text-[10px] uppercase text-neutral-700">
                      {tx.type}
                    </span>
                    {tx.source === 'recurring' && (
                      <span className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.2 text-[10px] text-neutral-600">
                        Auto-recurring
                      </span>
                    )}
                  </div>
                  {tx.note && (
                    <p className="mt-1 text-xs text-neutral-400 truncate">
                      {tx.note}
                    </p>
                  )}
                </div>

                <div className="text-right whitespace-nowrap">
                  <p className="text-sm font-bold tabular-nums text-black sm:text-base">
                    {tx.type === 'income' ? '+' : '-'}
                    {formatINR(tx.amount)}
                  </p>
                  <p className="text-[11px] text-neutral-400">Click to edit</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
