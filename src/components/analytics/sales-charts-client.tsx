"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Package, TrendingUp, ShoppingBag } from "lucide-react";


export default function SalesChartClient({ payload }: { payload: any }) {
  const daily = React.useMemo(() => {
    return (payload?.daily ?? []).map((d: any) => ({
      date: `${String(d._id.d).padStart(2, "0")}/${String(d._id.m).padStart(2, "0")}`,
      revenue: d.revenue,
      units: d.units,
    }));
  }, [payload?.daily]);

  const topProducts = payload?.topProducts ?? [];

  if (daily.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground">No sales data available for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full overflow-hidden">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col min-w-0">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Revenue Trend (Last 30 Days)
          </h3>
        </div>
        <div className="p-2 sm:p-4 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) => [`₹${value?.toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                dot={{
                  r: 3,
                  fill: "#000000",
                  strokeWidth: 0,
                  fillOpacity: 1
                }}
                activeDot={{
                  r: 6,
                  fill: "#3b82f6",
                  stroke: "#ffffff",
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col min-w-0">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Units Sold (Last 30 Days)
          </h3>
        </div>
        <div className="p-2 sm:p-4 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "currentColor", opacity: 0.05 }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) => [`${value} units`, "Sold"]}
              />
              <Bar
                dataKey="units"
                fill="currentColor"
                className="text-primary"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {topProducts.length > 0 && (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-2 min-w-0">
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold">Top 5 Products by Revenue</h3>
          </div>
          <div className="p-4 space-y-3">
            {topProducts.map((p: any, i: number) => (
              <div
                key={p._id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium truncate max-w-[150px] sm:max-w-xs">
                      Product ID: {p._id}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.units} units sold</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400">
                    ₹{p.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}