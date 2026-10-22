import { useFinance } from '../../context/useFinance';
import { formatINR, calculateTotals, calculateCategoryBreakdown, calculateRecurringCommitments } from '../../utils/calculations';

export default function Analytics({ onSelectTab }) {
  const { transactions, recurringPayments } = useFinance();

  const totals = calculateTotals(transactions);
  const categoryData = calculateCategoryBreakdown(transactions);
  const recurringMetrics = calculateRecurringCommitments(recurringPayments);

  // Financial health calculations
  const savingsRate = totals.totalIncome > 0
    ? Math.max(0, Math.round(((totals.totalIncome - totals.totalExpense) / totals.totalIncome) * 100))
    : 0;

  // Discretionary vs Fixed
  const fixedCommitments = recurringMetrics.totalMonthlyCommitment;
  const variableExpenses = Math.max(0, totals.totalExpense - fixedCommitments);

  // Top spending categories
  const topCategories = categoryData.categories.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Overview header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-black">
          Financial Analytics & Insights
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Derived from your recorded ledger and active commitments
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500">Savings Rate</p>
          <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums text-black">
            {savingsRate}%
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Of total recorded income retained
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500">Monthly Fixed Commitments</p>
          <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums text-black">
            {formatINR(fixedCommitments)}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Scheduled recurring baseline
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500">Discretionary Spending</p>
          <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums text-black">
            {formatINR(variableExpenses)}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Everyday flexible expenses
          </p>
        </div>
      </div>

      {/* Deep-Dive Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Outflow Drivers */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <h3 className="text-base font-semibold tracking-tight text-black mb-1">
            Top Outflow Drivers
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Categories accounting for majority of total spend
          </p>

          {topCategories.length === 0 ? (
            <p className="text-xs text-neutral-500">No expense records available.</p>
          ) : (
            <div className="space-y-4">
              {topCategories.map((c, index) => (
                <div key={c.category} className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-800">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-black">{c.category}</p>
                      <p className="text-[11px] text-neutral-500">{c.percentage}% of overall spend</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold tabular-nums text-black">
                    {formatINR(c.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commitment Breakdown & Review */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
          <h3 className="text-base font-semibold tracking-tight text-black mb-1">
            Subscription Review & Estimates
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Estimated annual commitment: {formatINR(fixedCommitments * 12)}
          </p>

          <div className="space-y-3">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs">
              <p className="font-semibold text-black">Estimated Annual Subscription Overhead</p>
              <p className="mt-1 text-neutral-600">
                You have {recurringPayments.length} active recurring commitments totaling approximately {formatINR(fixedCommitments)} each month. Reviewing unused digital services could free up estimated funds.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs">
              <p className="font-semibold text-black">Cash Flow Health</p>
              <p className="mt-1 text-neutral-600">
                {totals.netBalance >= 0
                  ? `Your net cash balance is positive at ${formatINR(totals.netBalance)}. Consistent savings habits keep you prepared for upcoming commitments.`
                  : `Outflows currently exceed inflows by ${formatINR(Math.abs(totals.netBalance))}. Consider reviewing non-essential discretionary expenses.`}
              </p>
            </div>
          </div>

          <div className="mt-5 text-right">
            <button
              type="button"
              onClick={() => onSelectTab('recurring')}
              className="text-xs font-semibold text-black hover:underline"
            >
              Review all recurring commitments &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
