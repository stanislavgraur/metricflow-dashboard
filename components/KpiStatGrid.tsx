import React from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface KPIMetric {
  label: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  trendColor: 'success' | 'danger';
  sparklineData?: number[];
}

export interface KpiStatGridProps {
  metrics?: KPIMetric[];
}

interface Point {
  x: number;
  y: number;
}

// ============================================================================
// SMOOTH PATH (кубические кривые Безье / Catmull-Rom)
// ============================================================================

const toSmoothPath = (points: Point[]): string => {
  if (points.length === 0) return '';
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
};

// ============================================================================
// SPARKLINE — сглаженная волна с градиентной заливкой
// ============================================================================

interface SparklineProps {
  data: number[];
  color: string;
  gradientId: string;
}

const Sparkline: React.FC<SparklineProps> = ({ data, color, gradientId }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const padding = 2;

  const points: Point[] = data.map((value, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - ((value - min) / range) * (height - padding * 2) - padding,
  }));

  const linePath = toSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${height} L ${points[0].x.toFixed(2)} ${height} Z`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const KpiStatGrid: React.FC<KpiStatGridProps> = ({
  metrics = [
    {
      label: 'TOTAL REVENUE',
      value: '$2,797.3M',
      trend: 14.2,
      trendLabel: '+14.2%',
      trendColor: 'success',
      sparklineData: [30, 42, 38, 50, 46, 58, 54, 62, 60, 74],
    },
    {
      label: 'MRR',
      value: '$692.4K',
      trend: 14.2,
      trendLabel: '+14.2%',
      trendColor: 'success',
      sparklineData: [25, 40, 35, 48, 52, 50, 58, 56, 52, 70],
    },
    {
      label: 'ACTIVE USERS',
      value: '3,336',
      trend: 14.2,
      trendLabel: '+14.2%',
      trendColor: 'success',
      sparklineData: [20, 30, 28, 40, 36, 52, 48, 50, 54, 66],
    },
    {
      label: 'CONVERSION RATE',
      value: '26.92%',
      trend: 14.2,
      trendLabel: '+14.2%',
      trendColor: 'success',
      sparklineData: [28, 36, 34, 44, 52, 48, 62, 44, 50, 64],
    },
  ],
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const badgeStyles =
          metric.trendColor === 'success'
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-red-500/15 text-red-400';

        const sparklineColor =
          metric.trendColor === 'success' ? '#10B981' : '#EF4444';

        return (
          <div
            key={index}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:bg-opacity-80 transition-colors"
          >
            {/* Top row: UPPERCASE Label + Trend Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--muted)] tracking-wider uppercase mb-1">
                {metric.label}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${badgeStyles}`}
              >
                {metric.trendLabel}
              </span>
            </div>

            {/* Metric Number */}
            <div className="text-[var(--foreground)] text-[32px] font-semibold leading-[1.1] mb-3">
              {metric.value}
            </div>

            {/* Bottom full-width smooth Sparkline */}
            <Sparkline
              data={metric.sparklineData ?? [40, 55, 45, 60, 50, 65, 55, 70, 60, 75]}
              color={sparklineColor}
              gradientId={`sparkline-gradient-${index}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default KpiStatGrid;