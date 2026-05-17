import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const SalesByCategoryChart = ({ data, currency = "₹" }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p>No category data available</p>
      </div>
    );
  }

  const chartData = data.map((cat) => ({
    name: cat.categoryName || "Unnamed",
    value: parseFloat(cat.totalSales),
  }));

  const chartOptions = {
    title: {
      text: "Sales by Category",
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
        `<strong>${name}</strong><br/>${currency}${Number(value).toLocaleString()} (${percent}%)`,
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
        color: "#4B5563",
        fontSize: 13,
      },
    },
    series: [
      {
        name: "Sales by Category",
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
          position: "center",
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
      "#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ef4444",
      "#14b8a6", "#8b5cf6", "#ec4899", "#22d3ee", "#f43f5e",
    ],
    animationDuration: 900,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <ReactECharts option={chartOptions} style={{ height: 400, width: "100%" }} />
    </div>
  );
};

export default SalesByCategoryChart;
