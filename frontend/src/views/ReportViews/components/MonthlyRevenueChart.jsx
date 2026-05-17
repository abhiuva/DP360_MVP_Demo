import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const MonthlyRevenueChart = ({ data, currency = "₹" }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p>No revenue data available</p>
      </div>
    );
  }

  const months = data.map((item) => item.month);
  const revenues = data.map((item) => parseFloat(item.totalRevenue));

  const chartOptions = {
    title: {
      text: "Monthly Revenue Overview",
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      formatter: function (params) {
        const item = params[0];
        return `
          <strong>${item.name}</strong><br/>
          Revenue: <span style="font-weight:500">
          ${currency}${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        `;
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
      bottom: "18%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: months,
      axisLabel: {
        rotate: 45,
        fontSize: 12,
        color: "#4B5563",
      },
      axisLine: { lineStyle: { color: "#E5E7EB" } },
    },
    yAxis: {
      type: "value",
      name: `Revenue (${currency})`,
      nameLocation: "middle",
      nameGap: 50,
      nameTextStyle: {
        fontSize: 14,
        color: "#1F2937",
      },
      axisLabel: {
        formatter: (val) => `${currency}${val.toLocaleString()}`,
        color: "#4B5563",
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#E5E7EB",
        },
      },
    },
    series: [
      {
        name: "Total Revenue",
        type: "bar",
        data: revenues,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#3b82f6" },
            { offset: 1, color: "#bfdbfe" },
          ]),
        },
        barMaxWidth: 40,
        emphasis: {
          itemStyle: {
            color: "#2563eb",
          },
        },
      },
    ],
    animationDuration: 900,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <ReactECharts option={chartOptions} style={{ height: 400, width: "100%" }} />
    </div>
  );
};

export default MonthlyRevenueChart;
