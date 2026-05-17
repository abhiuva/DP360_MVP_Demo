import React from "react";

const AverageOrderValue = ({ value, currency }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-500">Avg Order Value</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900">
        {currency}
        {Number(value).toFixed(2)}
      </p>
    </div>
  );
};

export default AverageOrderValue;

