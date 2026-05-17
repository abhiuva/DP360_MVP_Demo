import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

export default function PurchaseBreakdown({ data = [] }) {
  const { paid, due } = useMemo(() => {
    let p = 0, d = 0;
    for (const r of data) {
      p += Number(r.paid_amount || 0);
      d += Number(r.due_amount || 0);
    }
    return { paid: p, due: d };
  }, [data]);

  const option = {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: ["Sum"] },
    yAxis: { type: "value" },
    legend: { data: ["Paid", "Due"] },
    grid: { left: 32, right: 16, top: 32, bottom: 24 },
    series: [
      { type: "bar", name: "Paid", data: [paid] },
      { type: "bar", name: "Due",  data: [due]  },
    ],
  };

  return <ReactECharts option={option} style={{ height: 340, width: "100%" }} />;
}
