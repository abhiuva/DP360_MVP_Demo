import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const SalesPerHourChart = ({ data, currency = "₹" }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p>No hourly sales data available</p>
      </div>
    );
  }

  const hours = data.map((item) => `${item.hour}:00`);
  const sales = data.map((item) => parseFloat(item.totalSales));

  const chartOptions = {
    title: {
      text: "Hourly Sales Trend",
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#ddd",
      borderWidth: 1,
      textStyle: {
        color: "#333",
        fontSize: 14,
      },
      formatter: function (params) {
        const { name, value } = params[0];
        return `<strong>${name}</strong><br/>Sales: ${currency}${value.toFixed(2)}`;
      },
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#4B5563",
        },
      },
    },
    xAxis: {
      type: "category",
      data: hours,
      axisLabel: {
        rotate: 45,
        fontSize: 12,
        color: "#4B5563",
      },
    },
    yAxis: {
      type: "value",
      name: `Sales (${currency})`,
      nameTextStyle: {
        fontSize: 14,
        color: "#1F2937",
      },
      axisLabel: {
        formatter: (val) => `${currency}${val}`,
        color: "#4B5563",
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#E5E7EB",
        },
      },
    },
    grid: {
      left: "6%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
    },
    series: [
      {
        name: "Sales",
        type: "line",
        data: sales,
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: "#3b82f6",
        },
        itemStyle: {
          color: "#3b82f6",
          borderColor: "#fff",
          borderWidth: 2,
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#3b82f6" },
            { offset: 1, color: "rgba(59, 130, 246, 0)" },
          ]),
        },
        emphasis: {
          focus: "series",
        },
      },
    ],
    animationDuration: 1000,
    color: ["#3b82f6"],
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <ReactECharts option={chartOptions} style={{ height: 380, width: "100%" }} />
    </div>
  );
};

export default SalesPerHourChart;
