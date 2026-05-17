import React, { useState } from "react";

function Table({ rows }) {
  if (!rows?.length) return <div className="text-sm text-gray-500">No data.</div>;
  return (
    <div className="overflow-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Period</th>
            <th className="p-2 text-right">Revenue</th>
            <th className="p-2 text-right">Expense</th>
            <th className="p-2 text-right">Profit</th>
            <th className="p-2 text-right">Margin (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{r.period}</td>
              <td className="p-2 text-right">{Number(r.revenue||0).toLocaleString()}</td>
              <td className="p-2 text-right">{Number(r.expense||0).toLocaleString()}</td>
              <td className="p-2 text-right">{Number(r.profit||0).toLocaleString()}</td>
              <td className="p-2 text-right">{Number(r.margin||0).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FinancialReportsTable({ data }) {
  const [tab, setTab] = useState("monthly");
  const tabs = [
    { key: "monthly", label: "Monthly" },
    { key: "quarterly", label: "Quarterly" },
    { key: "yearly", label: "Yearly" },
  ];
  const rows = data?.[tab] || [];
  return (
    <>
      <div className="flex gap-2 mb-3">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`px-3 py-1.5 rounded border ${tab === t.key ? "bg-gray-900 text-white" : "bg-white"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <Table rows={rows} />
    </>
  );
}
