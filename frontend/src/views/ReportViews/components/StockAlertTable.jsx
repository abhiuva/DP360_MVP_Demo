import React from "react";

export default function StockAlertTable({ rows = [], hideAlertColor = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-3">Item</th>
            <th className="py-2 pr-3">Qty</th>
            <th className="py-2 pr-3">Alert</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const qty = Number(r?.quantity ?? 0);
            const alert = Number(r?.stock_alert_quantity ?? -1);
            const isAlert = qty <= alert && Number.isFinite(alert) && alert >= 0;
            return (
              <tr
                key={`${r?.title ?? "row"}-${i}`}
                className={[
                  "border-b",
                  (isAlert && !hideAlertColor) ? "bg-red-50" : "",
                  "hover:bg-gray-50"
                ].join(" ")}
              >
                <td className="py-2 pr-3">{r?.title ?? "-"}</td>
                <td className="py-2 pr-3">{Number.isFinite(qty) ? qty : "-"}</td>
                <td className="py-2 pr-3">{Number.isFinite(alert) && alert >= 0 ? alert : "-"}</td>
              </tr>
            );
          })}
          {!rows.length && (
            <tr><td className="py-4 text-gray-500" colSpan={3}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
