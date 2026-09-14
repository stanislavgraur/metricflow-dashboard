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

/**
 * Детерминированный генератор псевдослучайных чисел (seeded random)
 * Возвращает одинаковые значения для одних и тех же входных данных
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

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

const generateSparklineData = (baseValue: number, volatility: number, points: number, seed: number): number[] => {
  const data: number[] = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < points; i++) {
    // Используем seededRandom вместо Math.random для детерминированности
    const change = (seededRandom(seed + i) - 0.45) * volatility;
    currentValue = Math.max(baseValue * 0.7, currentValue * (1 + change));
    data.push(Math.round(currentValue));
  }
  
  return data;
};

const getLastNDays = (n: number): string[] => {
  const days: string[] = [];
  const now = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  
  return days;
};

const getLastNMonths = (n: number): string[] => {
  const months: string[] = [];
  const now = new Date();
  
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
  
  // Создаем детерминированный seed на основе периода
  const periodSeed = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[period];
  
  // Base values for 90d period
  const baseRevenue = 2_797_300_000;
  const baseMRR = 692_400_000;
  const baseUsers = 3336;
  // Детерминированное значение конверсии вместо Math.random()
  const baseConversion = 26.92;
  
  const revenue = baseRevenue * multiplier;
  const mrr = baseMRR * multiplier;
  const users = Math.round(baseUsers * Math.sqrt(multiplier));
  // Детерминированная вариация конверсии
  const conversionVariation = (seededRandom(periodSeed + 100) - 0.5) * 5;
  const conversion = baseConversion + conversionVariation;
  
  // Детерминированные тренды
  const trends = [
    14.2 + seededRandom(periodSeed + 1) * 2,
    12.8 + seededRandom(periodSeed + 2) * 2,
    18.5 + seededRandom(periodSeed + 3) * 2,
    9.3 + seededRandom(periodSeed + 4) * 2,
  ];
  
  return [
    {
      label: 'TOTAL REVENUE',
      value: formatCurrency(revenue),
      trend: trends[0],
      trendLabel: `+${trends[0].toFixed(1)}%`,
      trendColor: 'success' as const,
      sparklineData: generateSparklineData(revenue / 1_000_000, 0.08, 10, periodSeed + 1),
    },
    {
      label: 'MRR',
      value: formatCurrency(mrr),
      trend: trends[1],
      trendLabel: `+${trends[1].toFixed(1)}%`,
      trendColor: 'success' as const,
      sparklineData: generateSparklineData(mrr / 1_000_000, 0.06, 10, periodSeed + 2),
    },
    {
      label: 'ACTIVE USERS',
      value: formatNumber(users),
      trend: trends[2],
      trendLabel: `+${trends[2].toFixed(1)}%`,
      trendColor: 'success' as const,
      sparklineData: generateSparklineData(users, 0.1, 10, periodSeed + 3),
    },
    {
      label: 'CONVERSION RATE',
      value: `${conversion.toFixed(2)}%`,
      trend: trends[3],
      trendLabel: `+${trends[3].toFixed(1)}%`,
      trendColor: 'success' as const,
      sparklineData: generateSparklineData(conversion * 100, 0.05, 10, periodSeed + 4),
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
  
  const periodSeed = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[period];
  const { points, labels, baseDirect, baseEnterprise } = config[period];
  const data: ChartDataPoint[] = [];
  
  let runningDirect = baseDirect;
  let runningEnterprise = baseEnterprise;
  
  for (let i = 0; i < points; i++) {
    // Детерминированный рост вместо Math.random()
    const growthFactorDirect = 1 + (i * 0.02) + (seededRandom(periodSeed + i + 10) - 0.4) * 0.1;
    const growthFactorEnterprise = 1 + (i * 0.025) + (seededRandom(periodSeed + i + 20) - 0.4) * 0.1;
    
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

export const getAcquisitionChannels = (period: DateRangeOption): Channel[] => {
  // Channels remain relatively stable across periods
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
  const periodSeed = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[period];
  
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
  
  for (let i = 0; i < count; i++) {
    // Детерминированные дни вместо Math.random()
    const maxDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const daysAgo = Math.floor(seededRandom(periodSeed + i + 50) * maxDays);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    // Детерминированный статус
    const statusRand = seededRandom(periodSeed + i + 60);
    const statusIndex = statusRand > 0.8 ? 2 : statusRand > 0.5 ? 1 : 0;
    
    // Детерминированная сумма
    const amountRand = seededRandom(periodSeed + i + 70);
    const total = Math.round((amountRand * 1500 + 100) * 100) / 100;
    
    // Детерминированный метод оплаты
    const paymentIndex = Math.floor(seededRandom(periodSeed + i + 80) * paymentMethods.length);
    
    transactions.push({
      id: `1200${1000 + i}${Math.floor(seededRandom(periodSeed + i + 90) * 100)}`,
      customer: customers[i % customers.length],
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: statuses[statusIndex],
      total: total,
      paymentMethod: paymentMethods[paymentIndex],
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getSearchItems = (transactions: Transaction[]) => {
  return [
    { id: 'm-1', type: 'metric' as const, label: 'Total Revenue', hint: '$2,797.3M · +14.2%' },
    { id: 'm-2', type: 'metric' as const, label: 'MRR', hint: '$692.4K · +8.1%' },
    { id: 'm-3', type: 'metric' as const, label: 'Active Users', hint: '3,336 · -2.4%' },
    { id: 'm-4', type: 'metric' as const, label: 'Conversion Rate', hint: '26.92% · +5.7%' },
    ...transactions.slice(0, 4).map((t, i) => ({
      id: `t-${i + 1}`,
      type: 'transaction' as const,
      label: `Transaction #${t.id}`,
      hint: `${t.customer} · $${t.total.toFixed(2)}`,
    })),
  ];
};
