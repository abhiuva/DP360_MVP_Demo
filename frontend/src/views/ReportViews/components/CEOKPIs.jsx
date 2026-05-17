import React from "react";

const Card = ({ title, value, highlight=false }) => (
  <div className={`rounded-2xl shadow p-4 border ${highlight ? "bg-gradient-to-b from-emerald-50 to-white border-emerald-100" : "bg-white border-gray-100"} hover:shadow-md transition`}>
    <div className="text-[11px] tracking-wide uppercase text-gray-500">{title}</div>
    <div className="text-3xl font-semibold mt-1">{typeof value === "number" ? value.toLocaleString() : (value ?? "—")}</div>
  </div>
);

export default function CEOKPIs({ kpi }) {
  const list = [
    { title: "Revenue", value: kpi.revenue, highlight: true },
    { title: "Expenses", value: kpi.expenses },
    { title: "Net Profit", value: kpi.netProfit, highlight: kpi.netProfit >= 0 },
    { title: "Customer Due", value: kpi.customerDue },
    { title: "Supplier Due", value: kpi.supplierDue },
    { title: "Avg Ticket (AOV)", value: kpi.aov ? Number(kpi.aov).toFixed(2) : "—" },
  ];
  return (
    <>
      {list.map((x) => (
        <Card key={x.title} title={x.title} value={x.value} highlight={x.highlight} />
      ))}
    </>
  );
}
