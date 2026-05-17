import React from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";

export default function EmployeePerformanceRadar({ data }) {
  if (!data?.length) {
    return <div className="text-sm text-gray-500">No employee feedback yet.</div>;
  }
  // Take top 1–5 employees for clarity
  const top = data.slice(0, 5).map(e => ({
    name: e.employee_name,
    Service: Number(e.service || 0),
    Punctuality: Number(e.punctuality || e.punchuality || 0),
    "Customer Care": Number(e.customerCare || 0),
    "Manager Feedback": Number(e.managerFeedback || 0),
  }));
  // Recharts Radar needs one series; we’ll average across employees to show an org profile
  const keys = ["Service", "Punctuality", "Customer Care", "Manager Feedback"];
  const avg = keys.map(k => ({
    metric: k,
    value: top.reduce((s, r) => s + Number(r[k] || 0), 0) / top.length,
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={avg}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis />
          <Tooltip formatter={(v) => Number(v).toFixed(1)} />
          <Radar name="Avg" dataKey="value" strokeOpacity={0.8} fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
