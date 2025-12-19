"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SalesChartClient({ payload }: { payload: any }) {
  const daily = (payload?.daily ?? []).map((d: any) => ({
    day: `${d._id.y}-${String(d._id.m).padStart(2, "0")}-${String(d._id.d).padStart(2, "0")}`,
    revenue: d.revenue,
    units: d.units,
  }));

  if (daily.length === 0) {
    return <div className="text-sm text-muted-foreground">No sales data available.</div>;
  }

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="mb-3 text-sm font-medium">Revenue (last 30 days)</div>
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer>
          <LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
