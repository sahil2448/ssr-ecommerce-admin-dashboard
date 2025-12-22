"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Package } from "lucide-react";

export default function SalesChartClient({ payload }: { payload: any }) {
  const daily = (payload?.daily ?? []).map((d: any) => ({
    date: `${String(d._id.d).padStart(2, "0")}/${String(d._id.m).padStart(2, "0")}`,
    revenue: d.revenue,
    units: d.units,
  }));

  const topProducts = payload?.topProducts ?? [];

  if (daily.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">No sales data available for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-semibold mb-4">Revenue Trend (Last 30 Days)</h3>
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer>
            <LineChart data={daily} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11 }} 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11 }} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [`₹${value.toLocaleString()}`, "Revenue"]}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-semibold mb-4">Units Sold (Last 30 Days)</h3>
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer>
            <BarChart data={daily} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11 }} 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11 }} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [`${value} units`, "Sold"]}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar 
                dataKey="units" 
                fill="hsl(var(--primary))" 
                radius={[6, 6, 0, 0]}
                name="Units"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {topProducts.length > 0 && (
        <div className="rounded-lg border bg-card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4">Top 5 Products by Revenue</h3>
          <div className="space-y-3">
            {topProducts.map((p: any, i: number) => (
              <div key={p._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Product ID: {p._id}</div>
                    <div className="text-xs text-muted-foreground">{p.units} units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
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
