import React from "react";
import ReactECharts from "echarts-for-react";

export default function SalesVsExpensesChart({ data = [] }) {
  const dates = (data || []).map(d => d.order_date);
  const sales = (data || []).map(d => Number(d.sales || 0));
  const expenses = (data || []).map(d => Number(d.expenses || 0));

  const option = {
    tooltip: { trigger: "axis" },
    legend: { data: ["Sales", "Expenses"] },
    grid: { left: 32, right: 16, top: 32, bottom: 24 },
    xAxis: { type: "category", data: dates, boundaryGap: false },
    yAxis: { type: "value" },
    series: [
      { type: "line", name: "Sales", data: sales, smooth: true, areaStyle: {} },
      { type: "line", name: "Expenses", data: expenses, smooth: true },
    ],
  };
  return <ReactECharts option={option} style={{ height: 360, width: "100%" }} />;
}
