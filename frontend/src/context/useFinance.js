import { useContext } from 'react';
import { FinanceContext } from './FinanceContext';

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    return {
      transactions: [],
      recurringPayments: [],
      addTransaction: async (data) => data,
      updateTransaction: async () => {},
      deleteTransaction: async () => {},
      addRecurringPayment: async () => {},
      updateRecurringPayment: async () => {},
      deleteRecurringPayment: async () => {},
      markRecurringPaid: async () => {},
      loading: false,
      error: null,
    };
  }
  return context;
}

export default useFinance;
