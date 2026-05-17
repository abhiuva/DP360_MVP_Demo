import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

export default function PurchaseTrendChart({ data = [] }) {
  const series = useMemo(() => (data || []).map(d => ({
    date: d.order_date,
    total: Number(d.total_amount || 0),
    paid: Number(d.paid_amount || 0),
    due: Number(d.due_amount || 0),
  })), [data]);

  const option = {
    tooltip: { trigger: "axis" },
    legend: { data: ["Total", "Paid", "Due"] },
    xAxis: { type: "category", data: series.map(s => s.date), boundaryGap: false },
    yAxis: { type: "value" },
    grid: { left: 32, right: 16, top: 32, bottom: 24 },
    series: [
      { type: "line", name: "Total", data: series.map(s => s.total), smooth: true, areaStyle: {} },
      { type: "line", name: "Paid",  data: series.map(s => s.paid),  smooth: true },
      { type: "line", name: "Due",   data: series.map(s => s.due),   smooth: true },
    ],
  };

  return <ReactECharts option={option} style={{ height: 340, width: "100%" }} />;
}
