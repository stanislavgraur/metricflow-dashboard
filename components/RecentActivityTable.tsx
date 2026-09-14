'use client';

import React, { useEffect, useState } from 'react';
import { X, Download, CreditCard, Wallet } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface Transaction {
  id: string;
  customer: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  total: number;
  paymentMethod: string;
}

export interface RecentActivityTableProps {
  transactions?: Transaction[];
}

// ============================================================================
// STATUS BADGE
// ============================================================================

interface StatusBadgeProps {
  status: Transaction['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<
    Transaction['status'],
    { bg: string; text: string; dot: string }
  > = {
    Completed: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    Pending: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
    Failed: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
  };
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

// ============================================================================
// RECEIPT HELPERS
// ============================================================================

const calcFee = (total: number): number => +(total * 0.029 + 0.3).toFixed(2);
const calcSubtotal = (total: number): number => +(total - calcFee(total)).toFixed(2);
const fmt = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2 });

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  transactions = [
    {
      id: '12001305',
      customer: 'Hanes Smith',
      date: 'Sept 29, 2023',
      status: 'Completed',
      total: 276.0,
      paymentMethod: 'Credit Card ···· 4242',
    },
    {
      id: '12005302',
      customer: 'Google Dences',
      date: 'April 29, 2023',
      status: 'Pending',
      total: 197.0,
      paymentMethod: 'Stripe',
    },
    {
      id: '12006741',
      customer: 'Stripe Checkout',
      date: 'Oct 12, 2023',
      status: 'Completed',
      total: 1420.0,
      paymentMethod: 'Stripe',
    },
    {
      id: '12008920',
      customer: 'Acme Corp',
      date: 'Oct 15, 2023',
      status: 'Completed',
      total: 850.5,
      paymentMethod: 'Credit Card ···· 1881',
    },
  ],
}) => {
  const [selected, setSelected] = useState<Transaction | null>(null);

  /* Escape закрывает slide-over + блокировка скролла */
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected]);

  /* Реальное скачивание чека (.txt) через Blob */
  const handleDownloadReceipt = () => {
    if (!selected) return;
    const lines = [
      'MetricFlow — Official Receipt',
      '================================',
      `Transaction ID : ${selected.id}`,
      `Customer       : ${selected.customer}`,
      `Date           : ${selected.date}`,
      `Status         : ${selected.status}`,
      `Payment method : ${selected.paymentMethod}`,
      '--------------------------------',
      `Subtotal       : $${fmt(calcSubtotal(selected.total))}`,
      `Processing fee : $${fmt(calcFee(selected.total))}`,
      `TOTAL          : $${fmt(selected.total)}`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${selected.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#334155]">
          <h3 className="text-[#F8FAFC] text-lg font-semibold leading-[1.3]">Recent Activity</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                <th className="text-left text-[#94A3B8] text-xs font-medium px-6 py-3 h-10">Transaction ID</th>
                <th className="text-left text-[#94A3B8] text-xs font-medium px-6 py-3 h-10">Customer</th>
                <th className="text-left text-[#94A3B8] text-xs font-medium px-6 py-3 h-10">Date</th>
                <th className="text-left text-[#94A3B8] text-xs font-medium px-6 py-3 h-10">Status Pill Badge</th>
                <th className="text-right text-[#94A3B8] text-xs font-medium px-6 py-3 h-10">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="group hover:bg-[#334155]/30 transition-colors cursor-pointer h-[52px]"
                >
                  <td className="px-6 text-[#818CF8] text-sm font-medium group-hover:underline">
                    {t.id}
                  </td>
                  <td className="px-6 text-[#F8FAFC] text-sm">{t.customer}</td>
                  <td className="px-6 text-[#94A3B8] text-sm">{t.date}</td>
                  <td className="px-6">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-6 text-right text-[#F8FAFC] text-sm font-medium">
                    ${fmt(t.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================
          SLIDE-OVER SHEET — детали транзакции
          ================================================================== */}
      <div className={`fixed inset-0 z-[90] ${selected ? '' : 'pointer-events-none'}`} aria-hidden={!selected}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            selected ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSelected(null)}
        />

        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#1E293B] border-l border-[#334155] shadow-2xl shadow-black/60 flex flex-col transition-transform duration-300 ${
            selected ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selected && (
            <>
              {/* Sheet header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-[#334155] shrink-0">
                <div>
                  <h4 className="text-[#F8FAFC] text-base font-semibold">Transaction Details</h4>
                  <span className="text-[#818CF8] text-xs font-medium">#{selected.id}</span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close details"
                  className="p-2 rounded-lg text-slate-400 hover:text-[#F8FAFC] hover:bg-[#334155]/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sheet body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Status</span>
                  <StatusBadge status={selected.status} />
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Customer</div>
                    <div className="text-sm text-[#F8FAFC] font-medium">{selected.customer}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Date</div>
                    <div className="text-sm text-[#F8FAFC] font-medium">{selected.date}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Payment method</div>
                    <div className="text-sm text-[#F8FAFC] font-medium flex items-center gap-1.5">
                      {selected.paymentMethod.startsWith('Credit Card') ? (
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Wallet className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {selected.paymentMethod}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Amount</div>
                    <div className="text-sm text-[#F8FAFC] font-semibold">${fmt(selected.total)}</div>
                  </div>
                </div>

                {/* Receipt */}
                <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
                    Receipt breakdown
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-[#F8FAFC]">${fmt(calcSubtotal(selected.total))}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Processing fee (2.9% + $0.30)</span>
                      <span className="text-[#F8FAFC]">${fmt(calcFee(selected.total))}</span>
                    </div>
                    <div className="border-t border-[#334155] pt-2 flex items-center justify-between">
                      <span className="text-[#F8FAFC] font-medium">Total</span>
                      <span className="text-[#F8FAFC] font-semibold">${fmt(selected.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sheet footer */}
              <div className="px-6 py-4 border-t border-[#334155] shrink-0">
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full h-10 flex items-center justify-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
};

export default RecentActivityTable;