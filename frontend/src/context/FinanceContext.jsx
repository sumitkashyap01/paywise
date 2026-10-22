import { createContext, useState, useEffect, useCallback } from 'react';
import { advanceDueDate } from '../utils/dates';
export { useFinance } from './useFinance';

export const FinanceContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STORAGE_KEY_TRANSACTIONS = 'paywise_transactions';
const STORAGE_KEY_RECURRING = 'paywise_recurring';

// Realistic sample seed data for initial load
const SEED_TRANSACTIONS = [
  {
    id: 'tx_seed_1',
    title: 'Monthly Salary Credit',
    amount: 85000,
    type: 'income',
    category: 'Salary / Income',
    paymentMethod: 'Net Banking',
    date: '2026-10-01',
    note: 'October company payroll',
  },
  {
    id: 'tx_seed_2',
    title: 'Apartment Rent',
    amount: 22000,
    type: 'expense',
    category: 'Bills & Utilities',
    paymentMethod: 'UPI',
    date: '2026-10-05',
    note: 'House rent paid via UPI',
  },
  {
    id: 'tx_seed_3',
    title: 'Nature Basket Supermarket',
    amount: 3450,
    type: 'expense',
    category: 'Groceries',
    paymentMethod: 'Credit Card',
    date: '2026-10-12',
    note: 'Bi-weekly groceries',
  },
  {
    id: 'tx_seed_4',
    title: 'Blue Tokai Coffee & Bakery',
    amount: 680,
    type: 'expense',
    category: 'Food & Dining',
    paymentMethod: 'UPI',
    date: '2026-10-18',
    note: 'Team coffee hangout',
  },
  {
    id: 'tx_seed_5',
    title: 'Fuel - Shell Petrol Pump',
    amount: 2500,
    type: 'expense',
    category: 'Transportation',
    paymentMethod: 'Debit Card',
    date: '2026-10-20',
    note: 'Car full tank',
  },
  {
    id: 'tx_seed_6',
    title: 'Freelance UI Design',
    amount: 15000,
    type: 'income',
    category: 'Salary / Income',
    paymentMethod: 'Bank Transfer',
    date: '2026-10-21',
    note: 'Mobile app mockup milestone',
  },
];

const SEED_RECURRING = [
  {
    id: 'rec_seed_1',
    title: 'Netflix Premium (4K UHD)',
    amount: 649,
    frequency: 'monthly',
    category: 'Entertainment',
    paymentMethod: 'Credit Card',
    nextDueDate: '2026-10-25',
    status: 'due_soon',
    autoPay: true,
  },
  {
    id: 'rec_seed_2',
    title: 'JioFiber Broadband Gigabit',
    amount: 1179,
    frequency: 'monthly',
    category: 'Bills & Utilities',
    paymentMethod: 'UPI',
    nextDueDate: '2026-10-22',
    status: 'due_today',
    autoPay: false,
  },
  {
    id: 'rec_seed_3',
    title: 'HDFC Car Loan EMI',
    amount: 14500,
    frequency: 'monthly',
    category: 'Bills & Utilities',
    paymentMethod: 'Net Banking',
    nextDueDate: '2026-11-05',
    status: 'upcoming',
    autoPay: true,
  },
  {
    id: 'rec_seed_4',
    title: 'Cult.fit Gym & Fitness Pass',
    amount: 1250,
    frequency: 'monthly',
    category: 'Healthcare',
    paymentMethod: 'Credit Card',
    nextDueDate: '2026-10-19',
    status: 'overdue',
    autoPay: false,
  },
];

export function FinanceProvider({ children }) {
  // Initialize transactions
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SEED_TRANSACTIONS;
    } catch {
      return SEED_TRANSACTIONS;
    }
  });

  // Initialize recurring payments
  const [recurringPayments, setRecurringPayments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECURRING);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SEED_RECURRING;
    } catch {
      return SEED_RECURRING;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(recurringPayments));
    } catch (e) {
      console.error('Failed to save recurring payments to localStorage', e);
    }
  }, [recurringPayments]);

  // Fetch from backend API on mount
  useEffect(() => {
    async function fetchBackendData() {
      try {
        setLoading(true);
        setError(null);
        const [txRes, recRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/transactions`),
          fetch(`${API_BASE_URL}/recurring`),
        ]);

        if (txRes.status === 'fulfilled' && txRes.value.ok) {
          const txData = await txRes.value.json();
          if (Array.isArray(txData) && txData.length > 0) {
            setTransactions(txData);
          }
        }

        if (recRes.status === 'fulfilled' && recRes.value.ok) {
          const recData = await recRes.value.json();
          if (Array.isArray(recData) && recData.length > 0) {
            setRecurringPayments(recData);
          }
        }
      } catch {
        // Backend offline: gracefully keep state and localStorage
      } finally {
        setLoading(false);
      }
    }
    fetchBackendData();
  }, []);

  // Transactions CRUD
  const addTransaction = useCallback(async (transactionData) => {
    const newTx = {
      ...transactionData,
      id: transactionData.id || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: Number(transactionData.amount) || 0,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx),
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          setTransactions((prev) => prev.map((t) => (t.id === newTx.id ? saved : t)));
        }
      }
    } catch {
      // Kept in localStorage
    }

    return newTx;
  }, []);

  const updateTransaction = useCallback(async (id, updatedData) => {
    const formatted = {
      ...updatedData,
      amount: Number(updatedData.amount) || 0,
      updatedAt: new Date().toISOString(),
    };

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...formatted } : t))
    );

    try {
      await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatted),
      });
    } catch {
      // Kept in localStorage
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    try {
      await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // Kept in localStorage
    }
  }, []);

  // Recurring Payments CRUD
  const addRecurringPayment = useCallback(async (recurringData) => {
    const newItem = {
      ...recurringData,
      id: recurringData.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: Number(recurringData.amount) || 0,
      frequency: recurringData.frequency || 'monthly',
      createdAt: new Date().toISOString(),
    };

    setRecurringPayments((prev) => [newItem, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/recurring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch {
      // Kept in localStorage
    }

    return newItem;
  }, []);

  const updateRecurringPayment = useCallback(async (id, updatedData) => {
    const formatted = {
      ...updatedData,
      amount: Number(updatedData.amount) || 0,
      updatedAt: new Date().toISOString(),
    };

    setRecurringPayments((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...formatted } : r))
    );

    try {
      await fetch(`${API_BASE_URL}/recurring/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatted),
      });
    } catch {
      // Kept in localStorage
    }
  }, []);

  const deleteRecurringPayment = useCallback(async (id) => {
    setRecurringPayments((prev) => prev.filter((r) => r.id !== id));

    try {
      await fetch(`${API_BASE_URL}/recurring/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // Kept in localStorage
    }
  }, []);

  /**
   * markRecurringPaid:
   * 1. Records corresponding transaction in transactions list
   * 2. Advances recurring payment's next due date by its frequency
   */
  const markRecurringPaid = useCallback(async (recurringId) => {
    const item = recurringPayments.find((r) => r.id === recurringId);
    if (!item) return;

    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Record expense transaction
    await addTransaction({
      title: `${item.title} (Bill Paid)`,
      amount: item.amount,
      category: item.category || 'Bills & Utilities',
      paymentMethod: item.paymentMethod || 'UPI',
      type: 'expense',
      date: todayStr,
      note: `Recorded from recurring subscription (${item.frequency})`,
    });

    // 2. Advance due date
    const nextDate = advanceDueDate(item.nextDueDate || todayStr, item.frequency);
    await updateRecurringPayment(recurringId, {
      ...item,
      nextDueDate: nextDate,
      lastPaidDate: todayStr,
    });
  }, [recurringPayments, addTransaction, updateRecurringPayment]);

  // Reset data to seeds
  const resetToSampleData = useCallback(() => {
    setTransactions(SEED_TRANSACTIONS);
    setRecurringPayments(SEED_RECURRING);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(SEED_RECURRING));
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        recurringPayments,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addRecurringPayment,
        updateRecurringPayment,
        deleteRecurringPayment,
        markRecurringPaid,
        resetToSampleData,
        loading,
        error,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}
