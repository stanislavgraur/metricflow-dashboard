'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { KpiStatGrid } from '@/components/KpiStatGrid';
import { RevenueAcquisitionBlock } from '@/components/RevenueAcquisitionBlock';
import { RecentActivityTable } from '@/components/RecentActivityTable';
import type { DateRangeOption } from '@/lib/mock-data';
import {
  getKpiMetrics,
  getRevenueData,
  getAcquisitionChannels,
  getTransactions,
  getSearchItems,
} from '@/lib/mock-data';

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('30d');

  // Мемоизируем данные для предотвращения лишних пересчетов
  const kpiMetrics = useMemo(() => getKpiMetrics(selectedRange), [selectedRange]);
  const revenueData = useMemo(() => getRevenueData(selectedRange), [selectedRange]);
  const acquisitionChannels = useMemo(() => getAcquisitionChannels(selectedRange), [selectedRange]);
  const transactions = useMemo(() => getTransactions(selectedRange), [selectedRange]);
  const searchItems = useMemo(() => getSearchItems(transactions), [transactions]);

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      <Header
        initialDateRange={selectedRange === '7d' ? 'Last 7 Days' : selectedRange === '30d' ? 'Last 30 Days' : selectedRange === '90d' ? 'Last 90 Days' : 'This Year'}
        onDateRangeChange={(range) => {
          const rangeMap: Record<string, DateRangeOption> = {
            'Last 7 Days': '7d',
            'Last 30 Days': '30d',
            'Last 90 Days': '90d',
            'This Year': '1y',
          };
          setSelectedRange(rangeMap[range]);
        }}
        searchItems={searchItems}
      />
      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        <KpiStatGrid metrics={kpiMetrics} />
        <RevenueAcquisitionBlock
          revenueData={revenueData}
          acquisitionChannels={acquisitionChannels}
        />
        <RecentActivityTable transactions={transactions} />
      </main>
    </div>
  );
}