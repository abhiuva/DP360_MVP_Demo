import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

export default function ProfitMarginByCategoryBar({ data }) {
  const rows = (data || []).map(d => ({
    category: d.category || "Uncategorized",
    margin: Number(d.marginPercent || 0),
  }));
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" hide={rows.length > 8} />
          <YAxis unit="%" />
          <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, "Margin"]} />
          <Bar dataKey="margin" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
