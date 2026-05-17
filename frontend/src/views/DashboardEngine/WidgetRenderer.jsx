import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IconSparkles } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";

const COLORS = ["#0f766e", "#2563eb", "#f59e0b", "#ef4444", "#7c3aed", "#16a34a"];

function formatValue(payload, currencySymbol) {
  if (!payload) return "-";
  const value = payload.value ?? 0;
  if (payload.format === "currency") {
    return `${currencySymbol}${Number(value || 0).toLocaleString()}`;
  }
  return Number(value || 0).toLocaleString();
}

function EmptyState() {
  return (
    <div className="h-full min-h-[120px] flex items-center justify-center text-sm text-gray-400">
      No data available
    </div>
  );
}

function NumberWidget({ payload, currencySymbol }) {
  return (
    <div className="h-full flex flex-col justify-end">
      <div className="text-3xl font-semibold text-gray-950">
        {formatValue(payload, currencySymbol)}
      </div>
      <div className="text-xs text-gray-500 mt-2">Live from tenant data</div>
    </div>
  );
}

function LineChartWidget({ payload }) {
  const data = Array.isArray(payload) ? payload : [];
  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="salesTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0f766e" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#0f766e" fill="url(#salesTrendFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BarChartWidget({ payload }) {
  const data = Array.isArray(payload) ? payload : [];
  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#2563eb" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function PieChartWidget({ payload }) {
  const data = Array.isArray(payload) ? payload : [];
  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" innerRadius="52%" outerRadius="78%" paddingAngle={3}>
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function HalAiWidget({ payload }) {
  return (
    <div className="h-full flex flex-col justify-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
        <IconSparkles size={22} stroke={iconStroke} />
      </div>
      <p className="text-sm text-gray-600">{payload?.value || "HAL AI insights will appear here."}</p>
    </div>
  );
}

export default function WidgetRenderer({ widget, payload, currencySymbol }) {
  if (widget.visualization === "number") {
    return <NumberWidget payload={payload} currencySymbol={currencySymbol} />;
  }

  if (widget.visualization === "line_chart") {
    return <LineChartWidget payload={payload} />;
  }

  if (widget.visualization === "bar_chart") {
    return <BarChartWidget payload={payload} />;
  }

  if (widget.visualization === "pie_chart") {
    return <PieChartWidget payload={payload} />;
  }

  if (widget.visualization === "hal_ai") {
    return <HalAiWidget payload={payload} />;
  }

  return <EmptyState />;
}
