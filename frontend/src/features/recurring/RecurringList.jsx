import { useState } from 'react';
import { useFinance } from '../../context/useFinance';
import { formatDate, getDueStatus } from '../../utils/dates';
import { formatINR, calculateRecurringCommitments } from '../../utils/calculations';
import Badge from '../../components/Badge';

export default function RecurringList({ onOpenAdd, onSelectEdit }) {
  const { recurringPayments, markRecurringPaid } = useFinance();
  const [filter, setFilter] = useState('all'); // all, due_soon, overdue
  const [markingId, setMarkingId] = useState(null);

  const metrics = calculateRecurringCommitments(recurringPayments);

  const filteredItems = recurringPayments.filter((item) => {
    const dueInfo = getDueStatus(item.nextDueDate);
    if (filter === 'overdue') return dueInfo.status === 'overdue';
    if (filter === 'due_soon') return dueInfo.status === 'due_soon' || dueInfo.status === 'due_today';
    return true;
  });

  const handleMarkPaid = async (e, id) => {
    e.stopPropagation();
    setMarkingId(id);
    try {
      await markRecurringPaid(id);
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500">Monthly Commitments</p>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl text-black">
            {formatINR(metrics.totalMonthlyCommitment)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            Estimated monthly baseline
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500">Active Subscriptions & EMIs</p>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl text-black">
            {metrics.activeSubscriptionsCount}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            Across utilities, entertainment, loans
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500">Attention Required</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl text-black">
              {metrics.overdueCount + metrics.dueThisWeekCount}
            </span>
            <span className="text-xs text-neutral-500">
              ({metrics.overdueCount} overdue, {metrics.dueThisWeekCount} this week)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">
            Keep track to avoid late fees
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
        {/* Controls Row */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-black">
              Recurring Payments & Subscriptions ({recurringPayments.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Manage automatic commitments, due dates, and mark bills paid
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('due_soon')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'due_soon'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Due Soon
              </button>
              <button
                type="button"
                onClick={() => setFilter('overdue')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'overdue'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Overdue
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
            >
              + Add Commitment
            </button>
          </div>
        </div>

        {/* Notice on Mark as Paid */}
        <div className="mb-4 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-600">
          <strong>Note:</strong> Clicking &quot;Mark as Paid&quot; records the transaction in your expense history and advances the due date to the next cycle. (PayWise tracks expenses; it does not transfer actual money).
        </div>

        {/* List of Recurring items */}
        {filteredItems.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-10 text-center">
            <p className="text-sm font-semibold text-neutral-800">
              No recurring payments found
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {filter !== 'all'
                ? 'No items match the selected filter.'
                : 'Add your subscriptions, bills, or EMIs to track upcoming due dates.'}
            </p>
            <button
              type="button"
              onClick={onOpenAdd}
              className="mt-4 rounded-lg bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
            >
              + Add First Commitment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200">
            {filteredItems.map((item) => {
              const dueInfo = getDueStatus(item.nextDueDate);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectEdit(item)}
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                >
                  {/* Left Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-black truncate">
                        {item.title}
                      </p>
                      <Badge variant={dueInfo.status}>{dueInfo.label}</Badge>
                      {item.autoPay && (
                        <span className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.2 text-[10px] text-neutral-600">
                          Auto-Pay
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span>{item.category || 'General'}</span>
                      <span>•</span>
                      <span className="capitalize">{item.frequency || 'Monthly'}</span>
                      <span>•</span>
                      <span>Next due: {formatDate(item.nextDueDate)}</span>
                      {item.paymentMethod && (
                        <>
                          <span>•</span>
                          <span>{item.paymentMethod}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Actions & Amount */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <div className="text-left sm:text-right">
                      <p className="text-base font-bold tabular-nums text-black">
                        {formatINR(item.amount)}
                      </p>
                      <p className="text-[11px] text-neutral-400 capitalize">
                        per {item.frequency === 'yearly' ? 'year' : item.frequency === 'weekly' ? 'week' : 'month'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={markingId === item.id}
                        onClick={(e) => handleMarkPaid(e, item.id)}
                        title="Records payment in transactions and rolls due date forward"
                        className="rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-300"
                      >
                        {markingId === item.id ? 'Recording...' : 'Mark as Paid'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEdit(item);
                        }}
                        className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-100"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
