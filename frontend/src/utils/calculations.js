/**
 * Financial calculation and currency formatting utilities for PayWise.
 * Currency standard: INR (₹12,500.00)
 */

/**
 * Format numeric value to INR string (e.g. ₹12,500.00)
 */
export function formatINR(amount, includeSymbol = true) {
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return includeSymbol ? `₹${formatted}` : formatted;
}

/**
 * Calculate totals and summary metrics from transactions list
 */
export function calculateTotals(transactions = []) {
  let totalExpense = 0;
  let totalIncome = 0;

  for (const t of transactions) {
    const val = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += val;
    } else {
      totalExpense += val;
    }
  }

  const netBalance = totalIncome - totalExpense;

  return {
    totalExpense,
    totalIncome,
    netBalance,
    transactionCount: transactions.length,
  };
}

/**
 * Calculate category distribution for expenses
 */
export function calculateCategoryBreakdown(transactions = []) {
  const expenseTransactions = transactions.filter((t) => t.type !== 'income');
  const categoryMap = {};
  let totalExpense = 0;

  for (const t of expenseTransactions) {
    const val = Number(t.amount) || 0;
    const cat = t.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + val;
    totalExpense += val;
  }

  const breakdown = Object.keys(categoryMap)
    .map((category) => {
      const amount = categoryMap[category];
      const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
      return {
        category,
        amount,
        percentage: Math.round(percentage * 10) / 10,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return {
    categories: breakdown,
    totalExpense,
  };
}

/**
 * Calculate commitments for recurring payments
 */
export function calculateRecurringCommitments(recurringPayments = []) {
  let totalMonthlyCommitment = 0;
  let overdueCount = 0;
  let dueThisWeekCount = 0;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (const r of recurringPayments) {
    const amount = Number(r.amount) || 0;
    // Normalize to monthly equivalent
    if (r.frequency === 'yearly') {
      totalMonthlyCommitment += amount / 12;
    } else if (r.frequency === 'weekly') {
      totalMonthlyCommitment += amount * 4.33;
    } else {
      totalMonthlyCommitment += amount;
    }

    if (r.nextDueDate) {
      const due = new Date(r.nextDueDate);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        overdueCount++;
      } else if (diffDays <= 7) {
        dueThisWeekCount++;
      }
    }
  }

  return {
    totalMonthlyCommitment: Math.round(totalMonthlyCommitment),
    activeSubscriptionsCount: recurringPayments.length,
    overdueCount,
    dueThisWeekCount,
  };
}
