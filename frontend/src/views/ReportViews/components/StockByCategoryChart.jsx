import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const StockByCategoryChart = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white shadow rounded p-6 text-center text-gray-500">
        No stock data available
      </div>
    );
  }


  const sortedData = [...data].sort((a, b) => b.totalStock - a.totalStock);

  const categories = sortedData.map((item) => item.category);
  const stockValues = sortedData.map((item) => item.totalStock);

  const colors = [
    "#10b981", "#3b82f6", "#6366f1", "#f59e0b", "#ef4444", "#14b8a6",
    "#8b5cf6", "#ec4899", "#22d3ee", "#f43f5e",
  ];

  const chartOptions = {
    title: {
      text: "Stock by Category",
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const { name, value } = params[0];
        return `${name}<br/>Stock: <strong>${value}</strong>`;
      },
      backgroundColor: "#fff",
      borderColor: "#ddd",
      borderWidth: 1,
      textStyle: {
        color: "#333",
        fontSize: 14,
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "5%",
      top: 60,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: {
        fontSize: 12,
        color: "#4B5563",
      },
    },
    yAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        fontSize: 13,
        color: "#4B5563",
      },
    },
    series: [
      {
        name: "Stock",
        type: "bar",
        data: stockValues,
        barWidth: "60%",
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: (params) => colors[params.dataIndex % colors.length],
        },
        emphasis: {
          itemStyle: {
            opacity: 0.9,
          },
        },
      },
    ],
    animationDuration: 900,
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <ReactECharts option={chartOptions} style={{ height: 420, width: "100%" }} />
    </div>
  );
};

export default StockByCategoryChart;
