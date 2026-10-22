import { useFinance } from '../../context/useFinance';
import { formatINR, calculateTotals, calculateCategoryBreakdown, calculateRecurringCommitments } from '../../utils/calculations';
import { formatDate, getDueStatus } from '../../utils/dates';
import Badge from '../../components/Badge';

export default function Dashboard({
  onSelectTab,
  onOpenAddTransaction,
  onOpenAddRecurring,
  onSelectEditTransaction,
}) {
  const { transactions, recurringPayments, markRecurringPaid, resetToSampleData } = useFinance();

  const totals = calculateTotals(transactions);
  const categoryData = calculateCategoryBreakdown(transactions);
  const recurringMetrics = calculateRecurringCommitments(recurringPayments);

  // Recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  // Urgent upcoming bills
  const upcomingBills = [...recurringPayments]
    .map((item) => ({
      ...item,
      dueInfo: getDueStatus(item.nextDueDate),
    }))
    .filter((item) => item.dueInfo.status === 'overdue' || item.dueInfo.status === 'due_today' || item.dueInfo.status === 'due_soon')
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Financial Overview KPI Grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-black">
            Financial Overview
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToSampleData}
              title="Reload sample demonstration data"
              className="text-xs text-neutral-500 hover:text-black underline transition-colors"
            >
              Reset Sample Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Spending */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Total Expenses</span>
              <span className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">
                Outflow
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-black">
              {formatINR(totals.totalExpense)}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {totals.transactionCount} transactions recorded
            </p>
          </div>

          {/* Card 2: Total Income */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Total Income</span>
              <span className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">
                Inflow
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-black">
              {formatINR(totals.totalIncome)}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Across salaries & freelance earnings
            </p>
          </div>

          {/* Card 3: Net Cash Balance */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Net Balance</span>
              <span className="rounded border border-neutral-300 bg-white px-1.5 py-0.5 text-[10px] text-black">
                Current
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-black">
              {formatINR(totals.netBalance)}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Income minus recorded expenses
            </p>
          </div>

          {/* Card 4: Upcoming Recurring Commitments */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Monthly Subscriptions</span>
              <span className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">
                Commitments
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-black">
              {formatINR(recurringMetrics.totalMonthlyCommitment)}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {recurringMetrics.activeSubscriptionsCount} active bills & EMIs
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Spending Breakdown Chart (8 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Grayscale Category Spending Visualization */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-black">
                  Spending by Category
                </h3>
                <p className="text-xs text-neutral-500">
                  Distribution of {formatINR(categoryData.totalExpense)} in total expenses
                </p>
              </div>
            </div>

            {categoryData.categories.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center text-xs text-neutral-500">
                No expense data recorded yet.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {categoryData.categories.map((cat) => (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800">{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-black tabular-nums">
                          {formatINR(cat.amount)}
                        </span>
                        <span className="text-neutral-400">({cat.percentage}%)</span>
                      </div>
                    </div>
                    {/* Grayscale Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions Feed */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-black">
                  Recent Transactions
                </h3>
                <p className="text-xs text-neutral-500">Latest activity from your ledger</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('transactions')}
                className="text-xs font-semibold text-black hover:underline"
              >
                View all &rarr;
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center text-xs text-neutral-500">
                No recent activity.
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => onSelectEditTransaction(tx)}
                    className="flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-neutral-50"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-sm font-medium text-black">
                        {tx.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {tx.category} • {formatDate(tx.date)}
                      </p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-sm font-semibold tabular-nums text-black">
                        {tx.type === 'income' ? '+' : '-'}
                        {formatINR(tx.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Commitments & Quick Actions (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Upcoming Bills Snippet */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-black">
                  Upcoming Commitments
                </h3>
                <p className="text-xs text-neutral-500">Due today or in the next 7 days</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('recurring')}
                className="text-xs font-semibold text-black hover:underline"
              >
                Manage &rarr;
              </button>
            </div>

            {upcomingBills.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center text-xs text-neutral-500">
                No urgent bills due this week.
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {upcomingBills.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-semibold text-black">
                          {b.title}
                        </p>
                        <Badge variant={b.dueInfo.status}>{b.dueInfo.label}</Badge>
                      </div>
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        {formatINR(b.amount)} • {b.frequency}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => markRecurringPaid(b.id)}
                      className="rounded-md bg-black px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-neutral-800 shrink-0"
                    >
                      Mark Paid
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h3 className="text-base font-semibold tracking-tight text-black">
              Quick Actions
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Record data to keep your financial ledger synchronized
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onOpenAddTransaction}
                className="flex items-center justify-between rounded-lg bg-black px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
              >
                <span>+ Add Transaction</span>
                <span className="text-neutral-400">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={onOpenAddRecurring}
                className="flex items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-medium text-black transition-colors hover:bg-neutral-100"
              >
                <span>+ Add Recurring Subscription / EMI</span>
                <span className="text-neutral-500">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('analytics')}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
              >
                <span>View Analytics & Insights</span>
                <span className="text-neutral-400">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
