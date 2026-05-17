import React from "react";

export default function EmployeePerformanceTable({ rows = [] }) {
  if (!rows.length) return <div className="text-sm text-gray-500">No employee feedback.</div>;
  return (
    <div className="overflow-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Employee</th>
            <th className="p-2 text-right">Service</th>
            <th className="p-2 text-right">Punctuality</th>
            <th className="p-2 text-right">Customer Care</th>
            <th className="p-2 text-right">Manager Feedback</th>
            <th className="p-2 text-right">Overall Rating</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{r.employee_name}</td>
              <td className="p-2 text-right">{Number(r.service||0).toFixed(1)}</td>
              <td className="p-2 text-right">{Number(r.punctuality||r.punchuality||0).toFixed(1)}</td>
              <td className="p-2 text-right">{Number(r.customerCare||0).toFixed(1)}</td>
              <td className="p-2 text-right">{Number(r.managerFeedback||0).toFixed(1)}</td>
              <td className="p-2 text-right">{Number(r.rating||0).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
