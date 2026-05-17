import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const MonthlyTransactionCount = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0)
    return <p className="text-center text-gray-500">No transaction data</p>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Monthly Transactions
      </h2>
      <div style={{ height: 320 }}>
        <ResponsiveBar
          data={data}
          keys={["totalTransactions"]}
          indexBy="month"
          margin={{ top: 40, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: "set2" }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -30,
            legend: "Month",
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            legend: "Transactions",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          tooltip={({ id, value, indexValue }) => (
            <strong>
              {indexValue}: {value} {id}
            </strong>
          )}
          animate
          enableLabel={false}
          theme={{
            tooltip: {
              container: {
                background: "#fff",
                color: "#333",
                fontSize: "14px",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MonthlyTransactionCount;
