'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { X } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface RevenueData {
  month: string;
  direct: number;
  enterprise: number;
}

export interface AcquisitionChannel {
  name: string;
  percentage: number;
}

export interface ChannelAnalytics {
  name: string;
  share: number;
  sessions: number;
  conversionRate: number;
  revenue: number;
  trend: number;
}

export type ChartPeriod = 'Weekly' | 'Monthly';

export interface RevenueAcquisitionBlockProps {
  revenueData?: RevenueData[];
  weeklyData?: RevenueData[];
  acquisitionChannels?: AcquisitionChannel[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const DEFAULT_WEEKLY: RevenueData[] = [
  { month: 'W1', direct: 11200, enterprise: 6900 },
  { month: 'W2', direct: 12800, enterprise: 7400 },
  { month: 'W3', direct: 12100, enterprise: 7100 },
  { month: 'W4', direct: 13600, enterprise: 8200 },
  { month: 'W5', direct: 14200, enterprise: 8600 },
  { month: 'W6', direct: 13900, enterprise: 9100 },
  { month: 'W7', direct: 14800, enterprise: 9600 },
  { month: 'W8', direct: 15300, enterprise: 9900 },
  { month: 'W9', direct: 15900, enterprise: 10400 },
  { month: 'W10', direct: 15600, enterprise: 10800 },
  { month: 'W11', direct: 16400, enterprise: 11200 },
  { month: 'W12', direct: 17100, enterprise: 11700 },
];

const CHANNEL_ANALYTICS: ChannelAnalytics[] = [
  { name: 'Organic', share: 45, sessions: 48200, conversionRate: 4.8, revenue: 58400, trend: 12.4 },
  { name: 'Referral', share: 30, sessions: 31900, conversionRate: 3.6, revenue: 38900, trend: 6.1 },
  { name: 'Direct', share: 25, sessions: 26750, conversionRate: 3.1, revenue: 31200, trend: -1.8 },
  { name: 'Paid', share: 10, sessions: 10700, conversionRate: 2.2, revenue: 12800, trend: 3.5 },
];

// ============================================================================
// TOOLTIP & CURSOR
// ============================================================================

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-xl shadow-black/40">
        <p className="text-xs font-medium text-[var(--muted)] mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-[var(--foreground)] flex items-center gap-1.5 leading-5">
            <span className="w-2 h-2 rounded-[2px] shrink-0" style={{ backgroundColor: entry.color }} />
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface ChartCursorProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const ChartCursor: React.FC<ChartCursorProps> = ({ x = 0, y = 0, width = 0, height = 0 }) => (
  <line
    x1={x + width / 2}
    y1={y}
    x2={x + width / 2}
    y2={y + height}
    stroke="#6366F1"
    strokeWidth={1}
    strokeDasharray="4 4"
  />
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const RevenueAcquisitionBlock: React.FC<RevenueAcquisitionBlockProps> = ({
  revenueData = [
    { month: 'Jan', direct: 45000, enterprise: 27700 },
    { month: 'Feb', direct: 52000, enterprise: 31200 },
    { month: 'Mar', direct: 48000, enterprise: 27700 },
    { month: 'Apr', direct: 55000, enterprise: 35000 },
    { month: 'May', direct: 60000, enterprise: 38000 },
    { month: 'Jun', direct: 58000, enterprise: 42000 },
    { month: 'Jul', direct: 62000, enterprise: 45000 },
    { month: 'Aug', direct: 65000, enterprise: 48000 },
    { month: 'Sep', direct: 70000, enterprise: 50000 },
    { month: 'Oct', direct: 68000, enterprise: 52000 },
    { month: 'Nov', direct: 72000, enterprise: 55000 },
    { month: 'Dec', direct: 75000, enterprise: 58000 },
  ],
  weeklyData = DEFAULT_WEEKLY,
  acquisitionChannels = [
    { name: 'Organic', percentage: 45 },
    { name: 'Referral', percentage: 30 },
    { name: 'Direct', percentage: 25 },
    { name: 'Paid', percentage: 10 },
  ],
}) => {
  const [period, setPeriod] = useState<ChartPeriod>('Monthly');
  const [breakdownOpen, setBreakdownOpen] = useState<boolean>(false);

  const chartData = period === 'Monthly' ? revenueData : weeklyData;

  /* Escape + блокировка скролла для модалки */
  useEffect(() => {
    if (!breakdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBreakdownOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [breakdownOpen]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ==================================================================
            Monthly Revenue Breakdown — STACKED BAR CHART
            ================================================================== */}
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[var(--foreground)] text-lg font-semibold leading-[1.3]">
              Monthly Revenue Breakdown
            </h3>
            <div className="flex items-center gap-4">
              {/* Period toggle */}
              <div className="flex items-center gap-1 p-1 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                {(['Weekly', 'Monthly'] as ChartPeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      period === p
                        ? 'bg-[#334155] text-[var(--foreground)]'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span className="text-[var(--muted)] text-xs">Direct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-[var(--muted)] text-xs">Enterprise</span>
                </div>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={<ChartCursor />} />
              <Bar dataKey="direct" name="Direct" fill="#6366F1" stackId="a" radius={[0, 0, 0, 0]} barSize={28} />
              <Bar dataKey="enterprise" name="Enterprise" fill="#10B981" stackId="a" radius={[3, 3, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ==================================================================
            Top Acquisition Channels + Footer
            ================================================================== */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex flex-col">
          <h3 className="text-[var(--foreground)] text-lg font-semibold leading-[1.3]">
            Top Acquisition Channels
          </h3>

          <div className="flex flex-col justify-between flex-1 gap-4 mt-6">
            {acquisitionChannels.map((channel, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--muted)] text-sm">{channel.name}</span>
                  <span className="text-[var(--foreground)] text-sm font-semibold">{channel.percentage}%</span>
                </div>
                <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${channel.percentage}%`, backgroundColor: '#6366F1' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-[var(--border)]/40">
            <span className="text-[var(--muted)] text-xs">Overall conversion source</span>
            <button
              type="button"
              onClick={() => setBreakdownOpen(true)}
              className="text-[#818CF8] hover:text-[#6366F1] text-xs font-medium transition-colors"
            >
              View breakdown →
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================
          MODAL — подробная аналитика каналов
          ================================================================== */}
      {breakdownOpen && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setBreakdownOpen(false)}
          />
          <div className="relative mx-auto mt-20 w-[calc(100%-2rem)] max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--border)]">
              <div>
                <h4 className="text-[var(--foreground)] text-base font-semibold">Acquisition Channel Breakdown</h4>
                <span className="text-slate-500 text-xs">Detailed performance by channel · Last 30 Days</span>
              </div>
              <button
                onClick={() => setBreakdownOpen(false)}
                aria-label="Close breakdown"
                className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[#334155]/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {CHANNEL_ANALYTICS.map((ch) => (
                <div key={ch.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--foreground)] text-sm font-medium">{ch.name}</span>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ch.trend >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {ch.trend >= 0 ? '+' : ''}
                        {ch.trend}%
                      </span>
                    </div>
                    <span className="text-[var(--foreground)] text-sm font-semibold">{ch.share}%</span>
                  </div>
                  <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${ch.share}%`, backgroundColor: '#6366F1' }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Sessions</div>
                      <div className="text-sm text-[var(--foreground)] font-medium">{ch.sessions.toLocaleString('en-US')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Conv. Rate</div>
                      <div className="text-sm text-[var(--foreground)] font-medium">{ch.conversionRate}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Revenue</div>
                      <div className="text-sm text-[var(--foreground)] font-medium">${ch.revenue.toLocaleString('en-US')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div className="flex justify-end px-6 py-4 border-t border-[var(--border)]">
              <button
                onClick={() => setBreakdownOpen(false)}
                className="h-9 px-4 text-sm font-medium text-slate-200 bg-[#334155]/50 hover:bg-[#334155] rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RevenueAcquisitionBlock;