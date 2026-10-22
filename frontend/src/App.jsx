import { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Navbar from './components/Navbar';
import Form from './components/Form';
import RecurringModal from './features/recurring/RecurringModal';
import Dashboard from './features/dashboard/Dashboard';
import TransactionList from './features/transactions/TransactionList';
import RecurringList from './features/recurring/RecurringList';
import Analytics from './features/analytics/Analytics';

function PayWiseApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Transaction Modal State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Recurring Modal State
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);

  // Handlers for Transaction Modal
  const handleOpenAddTx = () => {
    setSelectedTx(null);
    setIsTxModalOpen(true);
  };

  const handleOpenEditTx = (tx) => {
    setSelectedTx(tx);
    setIsTxModalOpen(true);
  };

  const handleCloseTxModal = () => {
    setIsTxModalOpen(false);
    setSelectedTx(null);
  };

  // Handlers for Recurring Modal
  const handleOpenAddRec = () => {
    setSelectedRec(null);
    setIsRecModalOpen(true);
  };

  const handleOpenEditRec = (rec) => {
    setSelectedRec(rec);
    setIsRecModalOpen(true);
  };

  const handleCloseRecModal = () => {
    setIsRecModalOpen(false);
    setSelectedRec(null);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddTransaction={handleOpenAddTx}
        onOpenAddRecurring={handleOpenAddRec}
      />

      {/* Main Page Canvas */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectTab={setActiveTab}
            onOpenAddTransaction={handleOpenAddTx}
            onOpenAddRecurring={handleOpenAddRec}
            onSelectEditTransaction={handleOpenEditTx}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionList
            onOpenAdd={handleOpenAddTx}
            onSelectEdit={handleOpenEditTx}
          />
        )}

        {activeTab === 'recurring' && (
          <RecurringList
            onOpenAdd={handleOpenAddRec}
            onSelectEdit={handleOpenEditRec}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics onSelectTab={setActiveTab} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>PayWise &copy; 2026. Minimalist Monochrome Finance Platform.</p>
          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>Currency: INR (₹)</span>
            <span>•</span>
            <span>Local &amp; Backend Synchronized</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isTxModalOpen && (
        <Form
          key={selectedTx?.id || 'new-tx'}
          isOpen={isTxModalOpen}
          onClose={handleCloseTxModal}
          initialData={selectedTx}
          onSuccess={handleCloseTxModal}
          onDelete={handleCloseTxModal}
        />
      )}

      {isRecModalOpen && (
        <RecurringModal
          key={selectedRec?.id || 'new-rec'}
          isOpen={isRecModalOpen}
          onClose={handleCloseRecModal}
          initialData={selectedRec}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <PayWiseApp />
    </FinanceProvider>
  );
}
