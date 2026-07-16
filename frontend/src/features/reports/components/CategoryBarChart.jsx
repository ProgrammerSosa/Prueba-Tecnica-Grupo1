import { useReducedMotion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "../../../shared/utils/inventory";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-pollen/30 bg-cream-comb px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold text-cacao-ink">{label}</p>
      <p className="text-honeycomb">
        Stock: <span className="font-semibold text-cacao-ink">{formatNumber(payload[0].value)}</span>
      </p>
    </div>
  );
};

export const CategoryBarChart = ({ data = [] }) => {
  const prefersReducedMotion = useReducedMotion();

  if (!data.length) {
    return (
      <p className="text-sm text-honeycomb">
        Sin categorías para graficar todavía.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 8 }} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="3 3" stroke="#A78A50" strokeOpacity={0.2} vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fill: "#4A3428", fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: "#A78A50", strokeOpacity: 0.35 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#4A3428", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9B825", fillOpacity: 0.12 }} />
          <Bar
            dataKey="totalStock"
            fill="#F9B825"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
            isAnimationActive={!prefersReducedMotion}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
