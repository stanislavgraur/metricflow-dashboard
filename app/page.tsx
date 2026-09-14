import Header from '@/components/Header';
import { KpiStatGrid } from '@/components/KpiStatGrid';
import { RevenueAcquisitionBlock } from '@/components/RevenueAcquisitionBlock';
import { RecentActivityTable } from '@/components/RecentActivityTable';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <Header />
      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        <KpiStatGrid />
        <RevenueAcquisitionBlock />
        <RecentActivityTable />
      </main>
    </div>
  );
}