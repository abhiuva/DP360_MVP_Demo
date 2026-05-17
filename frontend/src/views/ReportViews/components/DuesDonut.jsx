import React from "react";
import ReactECharts from "echarts-for-react";

export default function DuesDonut({ customerDue = 0, supplierDue = 0 }) {
  const option = {
    tooltip: { trigger: "item" },
    legend: { top: "bottom" },
    series: [
      {
        name: "Dues",
        type: "pie",
        radius: ["45%", "70%"],
        avoidLabelOverlap: false,
        label: { show: true, formatter: "{b}: {d}%" },
        data: [
          { value: Number(customerDue || 0), name: "Customer Due" },
          { value: Number(supplierDue || 0), name: "Supplier Due" },
        ],
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 320, width: "100%" }} />;
}
