import React from "react";

export default function CustomerFeedbackList({ rows = [] }) {
  if (!rows.length) return <div className="text-sm text-gray-500">No feedback yet.</div>;
  return (
    <ul className="divide-y">
      {rows.map((f, i) => (
        <li key={i} className="py-3 flex items-start gap-3">
          <div className="min-w-12">
            <div className="text-xs text-gray-500">
              {new Date(f.created_at).toLocaleDateString()}
            </div>
            <div className="text-[11px] text-gray-400">{f.review_result}</div>
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{f.customer_name || "Customer"}</div>
            <div className="text-xs text-yellow-600 mb-1">{"★".repeat(Number(f.rating||0))}</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{f.review || "—"}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
