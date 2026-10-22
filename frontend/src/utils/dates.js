/**
 * Date formatting and due date calculation utilities for PayWise.
 * Standard format: 22 Oct 2026
 */

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format ISO or YYYY-MM-DD date string to '22 Oct 2026'
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Get today's date formatted as YYYY-MM-DD for date inputs
 */
export function getTodayInputDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate due status for recurring payments:
 * - 'overdue': due date is before today
 * - 'due_today': due date is today
 * - 'due_soon': due within next 7 days
 * - 'upcoming': due in more than 7 days
 */
export function getDueStatus(dueDateString) {
  if (!dueDateString) return 'upcoming';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'overdue', label: 'Overdue', daysLeft: diffDays };
  } else if (diffDays === 0) {
    return { status: 'due_today', label: 'Due Today', daysLeft: 0 };
  } else if (diffDays <= 7) {
    return { status: 'due_soon', label: `Due in ${diffDays}d`, daysLeft: diffDays };
  } else {
    return { status: 'upcoming', label: `In ${diffDays}d`, daysLeft: diffDays };
  }
}

/**
 * Advance due date by frequency (monthly, weekly, yearly)
 */
export function advanceDueDate(currentDueDateString, frequency = 'monthly') {
  const d = new Date(currentDueDateString || new Date());
  if (isNaN(d.getTime())) return getTodayInputDate();

  if (frequency === 'weekly') {
    d.setDate(d.getDate() + 7);
  } else if (frequency === 'yearly') {
    d.setFullYear(d.getFullYear() + 1);
  } else {
    // monthly default
    d.setMonth(d.getMonth() + 1);
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
