import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const TopItemsList = ({ items }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Top Selling Items
        </h2>
        <p className="text-gray-500 text-sm">No top-selling items available</p>
      </div>
    );
  }


  const sortedItems = [...items]
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 10);

  const itemNames = sortedItems.map((item, index) => {
    const name = item.itemName || "Unnamed Item";
    const emoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🔹";
    return `${emoji} ${name}`;
  });

  const itemQuantities = sortedItems.map((item) => item.totalQuantity);

  const chartOptions = {
    title: {
      text: "🏆 Top Selling Items",
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
        return `${name}<br/>Sold: <strong>${value}</strong>`;
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
        color: "#4B5563",
      },
    },
    yAxis: {
      type: "category",
      data: itemNames,
      axisLabel: {
        color: "#4B5563",
        fontSize: 13,
      },
    },
    series: [
      {
        name: "Quantity Sold",
        type: "bar",
        data: itemQuantities,
        barWidth: "60%",
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: "#3b82f6" },
            { offset: 1, color: "#93c5fd" },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: "#2563eb",
          },
        },
      },
    ],
    animationDuration: 800,
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <ReactECharts option={chartOptions} style={{ height: 420, width: "100%" }} />
    </div>
  );
};

export default TopItemsList;
