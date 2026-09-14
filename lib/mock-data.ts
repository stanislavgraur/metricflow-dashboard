// ============================================================================
// METRICFLOW - MOCK DATA LIBRARY
// Динамические данные для разных периодов ('7d', '30d', '90d', '1y')
// ============================================================================

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

export interface KpiMetric {
  label: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  trendColor: 'success' | 'danger';
  sparklineData: number[];
}

export interface ChartDataPoint {
  month: string;
  direct: number;
  enterprise: number;
}

export interface Channel {
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

export type DateRangeOption = '7d' | '30d' | '90d' | '1y';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
};

const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
};

// Simple seeded random number generator for consistent SSR/client rendering
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

const generateSparklineData = (baseValue: number, volatility: number, points: number, seed: number): number[] => {
  const data: number[] = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < points; i++) {
    const change = (seededRandom(seed + i) - 0.45) * volatility;
    currentValue = Math.max(baseValue * 0.7, currentValue * (1 + change));
    data.push(Math.round(currentValue));
  }
  
  return data;
};

// ============================================================================
// FIXED DATE HELPERS - using fixed reference date for SSR/client consistency
// ============================================================================

const REFERENCE_DATE = new Date(2024, 11, 15); // Fixed reference: Dec 15, 2024

const getLastNDays = (n: number): string[] => {
  const days: string[] = [];
  const now = REFERENCE_DATE;
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  
  return days;
};

const getLastNMonths = (n: number): string[] => {
  const months: string[] = [];
  const now = REFERENCE_DATE;
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    months.push(date.toLocaleDateString('en-US', { month: 'short' }));
  }
  
  return months;
};

// ============================================================================
// DATA GENERATORS BY PERIOD
// ============================================================================

export const getKpiMetrics = (period: DateRangeOption): KpiMetric[] => {
  const multipliers: Record<DateRangeOption, number> = {
    '7d': 0.15,
    '30d': 0.5,
    '90d': 1,
    '1y': 3,
  };
  
  const multiplier = multipliers[period];
  
  // Base values for 90d period
  const baseRevenue = 2_797_300_000;
  const baseMRR = 692_400_000;
  const baseUsers = 3336;
  const baseConversion = 26.92;
  
  const revenue = baseRevenue * multiplier;
  const mrr = baseMRR * multiplier;
  const users = Math.round(baseUsers * Math.sqrt(multiplier));
  // Use a deterministic conversion rate based on period to avoid hydration mismatch
  const conversionBase: Record<DateRangeOption, number> = {
    '7d': 25.5,
    '30d': 26.2,
    '90d': 26.92,
    '1y': 27.5,
  };
  const conversion = conversionBase[period];
  
  const trends = [14.2, 12.8, 18.5, 9.3];
  
  return [
    {
      label: 'TOTAL REVENUE',
      value: formatCurrency(revenue),
      trend: trends[0],
      trendLabel: `+${trends[0]}%`,
      trendColor: 'success' as const,
      sparklineData: generateSparklineData(revenue / 1_000_000, 0.08, 10, 1),
    },
    {
      label: 'MRR',
      value: formatCurrency(mrr),
      trend: trends[1],
      trendLabel: `+${trends[1]}%`,
      trendColor: 'success' as const,
      sparklineData: generateSparklineData(mrr / 1_000_000, 0.06, 10, 2),
    },
    {
      label: 'ACTIVE USERS',
      value: formatNumber(users),
      trend: trends[2],
      trendLabel: `+${trends[2]}%`,
      trendColor: 'success' as const,
      sparklineData: generateSparklineData(users, 0.1, 10, 3),
    },
    {
      label: 'CONVERSION RATE',
      value: `${conversion.toFixed(2)}%`,
      trend: trends[3],
      trendLabel: `+${trends[3]}%`,
      trendColor: 'success' as const,
      sparklineData: generateSparklineData(conversion * 100, 0.05, 10, 4),
    },
  ];
};

export const getRevenueData = (period: DateRangeOption): ChartDataPoint[] => {
  const config: Record<DateRangeOption, { points: number; labels: string[]; baseDirect: number; baseEnterprise: number }> = {
    '7d': {
      points: 7,
      labels: getLastNDays(7),
      baseDirect: 15000,
      baseEnterprise: 9000,
    },
    '30d': {
      points: 4,
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      baseDirect: 52000,
      baseEnterprise: 31000,
    },
    '90d': {
      points: 12,
      labels: getLastNMonths(12),
      baseDirect: 55000,
      baseEnterprise: 35000,
    },
    '1y': {
      points: 12,
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      baseDirect: 60000,
      baseEnterprise: 38000,
    },
  };
  
  const { points, labels, baseDirect, baseEnterprise } = config[period];
  const data: ChartDataPoint[] = [];
  
  let runningDirect = baseDirect;
  let runningEnterprise = baseEnterprise;
  
  // Use deterministic seed based on period for consistent SSR/client rendering
  const seedBase = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  
  for (let i = 0; i < points; i++) {
    const growthFactorDirect = 1 + (i * 0.02) + (seededRandom(seedBase + i) - 0.45) * 0.1;
    const growthFactorEnterprise = 1 + (i * 0.025) + (seededRandom(seedBase + i + 100) - 0.45) * 0.1;
    
    runningDirect = Math.round(runningDirect * growthFactorDirect);
    runningEnterprise = Math.round(runningEnterprise * growthFactorEnterprise);
    
    data.push({
      month: labels[i],
      direct: runningDirect,
      enterprise: runningEnterprise,
    });
  }
  
  return data;
};

export const getAcquisitionChannels = (_period: DateRangeOption): Channel[] => {
  // Channels remain relatively stable across periods; the argument is kept so this
  // function's signature matches its siblings (getKpiMetrics, getChannelAnalytics, etc.)
  return [
    { name: 'Organic', percentage: 45 },
    { name: 'Referral', percentage: 30 },
    { name: 'Direct', percentage: 25 },
    { name: 'Paid', percentage: 10 },
  ];
};

export const getChannelAnalytics = (period: DateRangeOption): ChannelAnalytics[] => {
  const multipliers: Record<DateRangeOption, number> = {
    '7d': 0.1,
    '30d': 0.33,
    '90d': 1,
    '1y': 4,
  };
  
  const multiplier = multipliers[period];
  
  return [
    {
      name: 'Organic',
      share: 45,
      sessions: Math.round(48200 * multiplier),
      conversionRate: 4.8,
      revenue: Math.round(58400 * multiplier),
      trend: 12.4,
    },
    {
      name: 'Referral',
      share: 30,
      sessions: Math.round(31900 * multiplier),
      conversionRate: 3.6,
      revenue: Math.round(38900 * multiplier),
      trend: 6.1,
    },
    {
      name: 'Direct',
      share: 25,
      sessions: Math.round(26750 * multiplier),
      conversionRate: 3.1,
      revenue: Math.round(31200 * multiplier),
      trend: -1.8,
    },
    {
      name: 'Paid',
      share: 10,
      sessions: Math.round(10700 * multiplier),
      conversionRate: 2.2,
      revenue: Math.round(12800 * multiplier),
      trend: 3.5,
    },
  ];
};

export const getTransactions = (period: DateRangeOption): Transaction[] => {
  const transactionCounts: Record<DateRangeOption, number> = {
    '7d': 5,
    '30d': 8,
    '90d': 12,
    '1y': 20,
  };
  
  const count = transactionCounts[period];
  const transactions: Transaction[] = [];
  
  const customers = [
    'Hanes Smith', 'Google Dences', 'Stripe Checkout', 'Acme Corp',
    'TechStart Inc', 'Global Solutions', 'Innovate Labs', 'Digital Dynamics',
    'Cloud Nine Systems', 'Apex Industries', 'Quantum Leap', 'Stellar Ventures',
  ];
  
  const statuses: Transaction['status'][] = ['Completed', 'Pending', 'Failed'];
  const paymentMethods = [
    'Credit Card ···· 4242',
    'Credit Card ···· 1881',
    'Stripe',
    'PayPal',
    'Bank Transfer',
  ];
  
  const now = new Date();
  // Use deterministic seed based on period for consistent SSR/client rendering
  const seedBase = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(seededRandom(seedBase + i) * (period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365));
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const statusRand = seededRandom(seedBase + i + 50);
    const statusIndex = statusRand > 0.8 ? 2 : statusRand > 0.5 ? 1 : 0;
    
    transactions.push({
      id: `1200${1000 + i}${Math.floor(seededRandom(seedBase + i + 100) * 100)}`,
      customer: customers[i % customers.length],
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: statuses[statusIndex],
      total: Math.round((seededRandom(seedBase + i + 150) * 1500 + 100) * 100) / 100,
      paymentMethod: paymentMethods[Math.floor(seededRandom(seedBase + i + 200) * paymentMethods.length)],
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getSearchItems = (transactions: Transaction[]) => {
  return [
    { id: 'm-1', type: 'metric' as const, label: 'Total Revenue', hint: '$2,797.3M · +14.2%' },
    { id: 'm-2', type: 'metric' as const, label: 'MRR', hint: '$692.4K · +14.2%' },
    { id: 'm-3', type: 'metric' as const, label: 'Active Users', hint: '3,336 · +14.2%' },
    { id: 'm-4', type: 'metric' as const, label: 'Conversion Rate', hint: '26.92% · +14.2%' },
    ...transactions.slice(0, 4).map((t, i) => ({
      id: `t-${i + 1}`,
      type: 'transaction' as const,
      label: `Transaction #${t.id}`,
      hint: `${t.customer} · $${t.total.toFixed(2)}`,
    })),
  ];
};
