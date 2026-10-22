import { useState } from 'react';

export default function Navbar({
  activeTab = 'dashboard',
  onSelectTab,
  onOpenAddTransaction,
  onOpenAddRecurring,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'recurring', label: 'Recurring & Bills' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex cursor-pointer items-center gap-2.5 select-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
              PW
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-black">
                PayWise
              </span>
              <span className="ml-2 hidden rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 sm:inline-block">
                INR (₹)
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-100 text-black font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <button
              type="button"
              onClick={onOpenAddRecurring}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-100"
            >
              + Bill / Sub
            </button>
            <button
              type="button"
              onClick={onOpenAddTransaction}
              className="flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Transaction</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-black md:hidden"
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
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-neutral-100 text-black font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-col gap-2 border-t border-neutral-200 pt-3">
            <button
              type="button"
              onClick={() => {
                onOpenAddTransaction();
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-lg bg-black px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
            >
              + Add Transaction
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenAddRecurring();
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-xs font-medium text-black transition-colors hover:bg-neutral-100"
            >
              + Add Recurring Bill
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
