import React from "react";
import ReactECharts from "echarts-for-react";

export default function ProfitBarChart({ data = [] }) {
  const dates = (data || []).map(d => d.order_date);
  const profit = (data || []).map(d => Number(d.profit || 0));

  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 32, right: 16, top: 32, bottom: 24 },
    xAxis: { type: "category", data: dates },
    yAxis: { type: "value" },
    series: [{ type: "bar", name: "Profit", data: profit }],
  };
  return <ReactECharts option={option} style={{ height: 360, width: "100%" }} />;
}
