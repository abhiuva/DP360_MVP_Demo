import React from "react";
import ReactECharts from "echarts-for-react";

const SalesChart = ({ data, currency = "₹" }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Sales by Day
        </h2>
        <p className="text-gray-500 text-sm">No sales data available</p>
      </div>
    );
  }

  const chartOptions = {
    title: {
      text: "Sales by Day",
      left: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        const point = params[0];
        return `Date: ${point.axisValue}<br/>${point.seriesName}: ${currency}${point.data}`;
      },
      backgroundColor: "#fff",
      borderColor: "#ddd",
      borderWidth: 1,
      textStyle: {
        color: "#333",
        fontSize: 14,
      },
    },
    xAxis: {
      type: "category",
      data: data.map((d) => d.order_date),
      axisLabel: {
        rotate: 45,
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: `{value} ${currency}`,
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "20%",
      containLabel: true,
    },
    series: [
      {
        name: "Daily Sales",
        type: "line",
        data: data.map((d) => d.dailySales),
        smooth: true,
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: "#3b82f6",
        },
        itemStyle: {
          color: "#3b82f6",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#3b82f6" },
              { offset: 1, color: "rgba(59, 130, 246, 0)" },
            ],
          },
        },
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <ReactECharts option={chartOptions} style={{ height: 360, width: "100%" }} />
    </div>
  );
};

export default SalesChart;
