import React from "react";
import CountUp from "react-countup";

const KPIBox = ({ title, value, currency }) => {
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow rounded-xl p-6 text-center hover:shadow-lg transition duration-300">
      <h2 className="text-sm font-medium text-gray-600 uppercase mb-2 tracking-wider">
        {title}
      </h2>
      <p className="text-3xl font-extrabold text-gray-800">
        <CountUp
          end={Number(value)}
          duration={1.5}
          separator=","
          decimals={value % 1 !== 0 ? 2 : 0}
          prefix={currency || ""}
        />
      </p>
    </div>
  );
};

export default KPIBox;
