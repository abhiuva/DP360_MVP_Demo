import React from "react";

export default function InventoryKPIs({
  kpi = { totalSKUs: 0, totalQty: 0, suppliers: 0, lowStock: 0 },
  labels = {},
}) {
  const text = {
    totalSKUs: "Total SKUs",
    totalQty: "Total Quantity",
    suppliers: "Suppliers",
    lowStock: "Low Stock",
    ...labels,
  };

  const Card = ({ label, value }) => (
    <div className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white">
      <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );

  return (
    <>
      <Card label={text.totalSKUs} value={kpi.totalSKUs ?? 0} />
      <Card label={text.totalQty} value={kpi.totalQty ?? 0} />
      <Card label={text.suppliers} value={kpi.suppliers ?? 0} />
      <Card label={text.lowStock} value={kpi.lowStock ?? 0} />
    </>
  );
}
