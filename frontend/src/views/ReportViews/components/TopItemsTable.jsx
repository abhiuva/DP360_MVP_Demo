import React from "react";

export default function TopItemsTable({ rows = [] }) {
  const normalized = (rows || [])
    .map(r => ({
      title: r?.title ?? r?.item_name ?? "-",
      quantity: Number(r?.quantity ?? r?.qty ?? 0),
      total: Number(r?.total_amount ?? r?.total ?? 0),
    }))
    .filter(r => r.quantity > 0 || r.total > 0)
    .sort((a,b) => b.quantity - a.quantity)
    .slice(0, 10);

  if (!normalized.length) {
    return (
      <div className="h-[320px] w-full flex items-center justify-center text-gray-500 text-sm">
        No top items in this range.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-3">Item</th>
            <th className="py-2 pr-3">Qty</th>
            <th className="py-2 pr-3">Sales</th>
          </tr>
        </thead>
        <tbody>
          {normalized.map((r, i) => (
            <tr key={`${r.title}-${i}`} className="border-b hover:bg-gray-50">
              <td className="py-2 pr-3">{r.title}</td>
              <td className="py-2 pr-3">{Number.isFinite(r.quantity) ? r.quantity : "-"}</td>
              <td className="py-2 pr-3">{Number.isFinite(r.total) ? r.total.toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
