import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const SalesByPaymentMode = ({ data, currency = "₹" }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white shadow rounded p-4 text-center text-gray-500">
        No payment data
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.paymentMode || "Unknown",
    value: parseFloat(item.totalSales),
  }));

  const totalSales = chartData.reduce((sum, item) => sum + item.value, 0);

  const chartOptions = {
    title: {
      text: "Sales by Payment Mode",
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: ({ name, value, percent }) =>
        `<strong>${name}</strong><br/>${currency}${value.toLocaleString()} (${percent}%)`,
      backgroundColor: "#fff",
      borderColor: "#ddd",
      borderWidth: 1,
      textStyle: {
        color: "#333",
        fontSize: 14,
      },
      position: function (point, params, dom, rect, size) {
        const [x, y] = point;
        const tooltipWidth = size.contentSize[0];
        const tooltipHeight = size.contentSize[1];
        const chartWidth = size.viewSize[0];

        const offsetX = x + tooltipWidth + 20 > chartWidth ? -tooltipWidth - 20 : 20;
        return [x + offsetX, y - tooltipHeight / 2];
      },
    },
    legend: {
      bottom: 10,
      left: "center",
      itemWidth: 14,
      itemHeight: 14,
      textStyle: {
        fontSize: 13,
        color: "#4B5563",
      },
      formatter: function (name) {
        const item = chartData.find((i) => i.name === name);
        const percentage = ((item.value / totalSales) * 100).toFixed(1);
        return `${name} (${percentage}%)`;
      },
    },
    series: [
      {
        name: "Sales by Payment Mode",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            color: "#111827",
            formatter: "{b}\n{d}%",
          },
        },
        labelLine: {
          show: false,
        },
        data: chartData,
      },
    ],
    color: [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    ],
    animationDuration: 900,
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <ReactECharts option={chartOptions} style={{ height: 400, width: "100%" }} />
    </div>
  );
};

export default SalesByPaymentMode;
