import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import Page from "../../components/Page";

// Reuse your existing charts/components
import SalesVsExpensesChart from "./components/SalesVsExpensesChart";
import EmptyState from "./components/EmptyState";

// New lightweight components used by CEO page
import ProfitMarginByCategoryBar from "./components/ProfitMarginByCategoryBar";
import EmployeePerformanceRadar from "./components/EmployeePerformanceRadar";
import FinancialReportsTable from "./components/FinancialReportsTable";
import CustomerFeedbackList from "./components/CustomerFeedbackList";
import EmployeePerformanceTable from "./components/EmployeePerformanceTable";

// CEO controllers (ApiClient-based)
import {
  ceoGetRevenueExpenses,
  ceoGetProfitMarginsByCategory,
  ceoGetEmployeePerformance,
  ceoGetFinancialSummaries,
  ceoGetCustomerFeedback,
  ceoGetOperationalEfficiency,
} from "../../controllers/ceo.controller";

// ------------ helpers ------------
const PERIOD_CHOICES = [
  { label: "Today", value: "today" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
];

const PERIOD_TO_GROUP = {
  today: "daily",
  week: "weekly",
  month: "monthly",
  quarter: "weekly",
  year: "monthly",
};

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function getTenantIdSafely() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return obj?.tenant_id ?? obj?.tenantId ?? null;
  } catch {
    return null;
  }
}

function calcRange(choice) {
  const today = dayjs();
  switch (choice) {
    case "today":
      return {
        start: today.startOf("day").format("YYYY-MM-DD"),
        end: today.endOf("day").format("YYYY-MM-DD"),
      };
    case "week":
      return {
        start: today.startOf("week").format("YYYY-MM-DD"),
        end: today.endOf("week").format("YYYY-MM-DD"),
      };
    case "month":
      return {
        start: today.startOf("month").format("YYYY-MM-DD"),
        end: today.endOf("month").format("YYYY-MM-DD"),
      };
    case "quarter":
      return {
        start: today.startOf("quarter").format("YYYY-MM-DD"),
        end: today.endOf("quarter").format("YYYY-MM-DD"),
      };
    default: // year
      return {
        start: today.startOf("year").format("YYYY-MM-DD"),
        end: today.endOf("year").format("YYYY-MM-DD"),
      };
  }
}

export default function CEODashboardReactPage() {
  const tenantId = getTenantIdSafely();

  // Dropdown for logical period buckets
  const [periodChoice, setPeriodChoice] = useState("month");

  // Manual date inputs (like Inventory page) + quick buttons
  const initial = calcRange("month");
  const [startDate, setStartDate] = useState(initial.start);
  const [endDate, setEndDate] = useState(initial.end);
  const [quickRange, setQuickRange] = useState("30d"); // '7d' | '30d' | 'q' | 'ytd'

  // Grouping granularity derived from dropdown
  const groupBy = PERIOD_TO_GROUP[periodChoice];

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [revExpSeries, setRevExpSeries] = useState([]); // {bucket, revenue, expense}
  const [profitByCat, setProfitByCat] = useState([]);   // {category, marginPercent}
  const [empPerf, setEmpPerf] = useState([]);           // radar + table
  const [financials, setFinancials] = useState({ monthly: [], quarterly: [], yearly: [] });
  const [feedback, setFeedback] = useState([]);         // detailed list
  const [efficiency, setEfficiency] = useState({ completed: 0, total: 0, efficiencyPercent: 0 });

  const printRef = useRef(null);

  // Keep dropdown in sync with dates if user changes periodChoice
  useEffect(() => {
    const r = calcRange(periodChoice);
    setStartDate(r.start);
    setEndDate(r.end);
    // also update the quickRange highlight
    if (periodChoice === "today") setQuickRange(null);
    else if (periodChoice === "week") setQuickRange("7d");
    else if (periodChoice === "month") setQuickRange("30d");
    else if (periodChoice === "quarter") setQuickRange("q");
    else if (periodChoice === "year") setQuickRange("ytd");
  }, [periodChoice]);

  // Quick range buttons (match Inventory UX)
  function applyQuickRange(preset) {
    setQuickRange(preset);
    const today = dayjs();
    if (preset === "7d") {
      setStartDate(today.subtract(6, "day").format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
      setPeriodChoice("week");
    } else if (preset === "30d") {
      setStartDate(today.subtract(29, "day").format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
      setPeriodChoice("month");
    } else if (preset === "q") {
      const qStart = today.startOf("quarter");
      setStartDate(qStart.format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
      setPeriodChoice("quarter");
    } else if (preset === "ytd") {
      setStartDate(today.startOf("year").format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
      setPeriodChoice("year");
    }
  }

  const rangeInvalid = dayjs(startDate).isAfter(dayjs(endDate));

  // fetch all
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // Backend uses legacy params(): tenant from session or ?tenantId; accepts from/to
        const [series, margins, emp, fin, fb, eff] = await Promise.all([
          ceoGetRevenueExpenses({ tenantId, period: groupBy, from: startDate, to: endDate }),
          ceoGetProfitMarginsByCategory({ tenantId, from: startDate, to: endDate }),
          ceoGetEmployeePerformance({ tenantId }),
          ceoGetFinancialSummaries({ tenantId, from: startDate, to: endDate }),
          ceoGetCustomerFeedback({ tenantId, from: startDate, to: endDate }),
          ceoGetOperationalEfficiency({ tenantId, from: startDate, to: endDate }),
        ]);
        if (!alive) return;
        setRevExpSeries(series || []);
        setProfitByCat(margins || []);
        setEmpPerf(emp || []);
        setFinancials(fin || { monthly: [], quarterly: [], yearly: [] });
        setFeedback(fb || []);
        setEfficiency(eff || { completed: 0, total: 0, efficiencyPercent: 0 });
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load CEO dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [tenantId, groupBy, startDate, endDate]);

  // ---------- KPIs ----------
  const kpi = useMemo(() => {
    const revenue = revExpSeries.reduce((s, r) => s + num(r.revenue), 0);
    const expense = revExpSeries.reduce((s, r) => s + num(r.expense), 0);
    const netProfit = revenue - expense;
    const netProfitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    const csat = feedback.length
      ? (feedback.reduce((s, f) => s + num(f.rating), 0) / (feedback.length * 5)) * 100
      : 0;

    const empScore = empPerf.length
      ? (empPerf.reduce((s, e) => {
          const avg = (num(e.service) + num(e.punctuality ?? e.punchuality) + num(e.customerCare) + num(e.managerFeedback)) / 4;
          return s + avg;
        }, 0) / empPerf.length / 5) * 100
      : 0;

    const operationalEfficiency = num(efficiency.efficiencyPercent);

    return { revenue, netProfitMargin, csat, empScore, operationalEfficiency };
  }, [revExpSeries, feedback, empPerf, efficiency]);

  // ---------- Export helpers ----------
  function exportCSV(filename, rows, columns) {
    const header = columns.map((c) => `"${c.header}"`).join(",");
    const body = (rows || [])
      .map((r) => columns.map((c) => `"${(r[c.key] ?? "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function exportFinancialsCSV() {
    const rows = [
      ...(financials.monthly || []).map((x) => ({ scope: "Monthly", ...x })),
      ...(financials.quarterly || []).map((x) => ({ scope: "Quarterly", ...x })),
      ...(financials.yearly || []).map((x) => ({ scope: "Yearly", ...x })),
    ];
    exportCSV(`financial_summaries_${startDate}_${endDate}.csv`, rows, [
      { key: "scope", header: "Scope" },
      { key: "period", header: "Period" },
      { key: "revenue", header: "Revenue" },
      { key: "expense", header: "Expense" },
      { key: "profit", header: "Profit" },
      { key: "margin", header: "Margin (%)" },
    ]);
  }

  function exportPagePDF() {
    if (!printRef.current) return;
    const original = document.body.innerHTML;
    const printHtml = printRef.current.innerHTML;
    document.body.innerHTML = printHtml;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  }

  const hasSeries = revExpSeries.some((r) => r.revenue || r.expense);

  return (
    <Page>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl font-semibold">CEO Dashboard</h3>
          <div className="text-xs text-gray-500">
            <span className="font-medium">{dayjs().format("DD MMM YYYY")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time-bucket dropdown */}
          <select
            className="border rounded px-2 py-1"
            value={periodChoice}
            onChange={(e) => setPeriodChoice(e.target.value)}
          >
            {PERIOD_CHOICES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Manual date inputs (like Inventory) */}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>–</span>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {/* Quick range buttons (Inventory-style) */}
          <button
            className={`px-3 py-1.5 rounded border ${quickRange === "7d" ? "bg-gray-900 text-white" : "bg-white"}`}
            onClick={() => applyQuickRange("7d")}
          >
            7D
          </button>
          <button
            className={`px-3 py-1.5 rounded border ${quickRange === "30d" ? "bg-gray-900 text-white" : "bg-white"}`}
            onClick={() => applyQuickRange("30d")}
          >
            30D
          </button>
          <button
            className={`px-3 py-1.5 rounded border ${quickRange === "q" ? "bg-gray-900 text-white" : "bg-white"}`}
            onClick={() => applyQuickRange("q")}
          >
            Quarter
          </button>
          <button
            className={`px-3 py-1.5 rounded border ${quickRange === "ytd" ? "bg-gray-900 text-white" : "bg-white"}`}
            onClick={() => applyQuickRange("ytd")}
          >
            YTD
          </button>

          {/* Exports */}
          <button className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50" onClick={exportFinancialsCSV}>
            Export Excel (CSV)
          </button>
          <button className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50" onClick={exportPagePDF}>
            Export PDF
          </button>
        </div>
      </div>

      {/* Range validation hint */}
      <div className={`mt-2 text-sm ${rangeInvalid ? "text-red-600" : "text-gray-500"}`}>
        {rangeInvalid ? "End date must be on/after start date" : "Inclusive date range"}
      </div>

      {/* Loading / Error */}
      {loading && <div className="mt-4 rounded-xl bg-white shadow p-4">Loading…</div>}
      {err && !loading && <div className="mt-4 rounded-xl bg-red-50 text-red-700 border border-red-200 p-3">{err}</div>}

      {/* Content */}
      {!loading && !err && (
        <div ref={printRef}>
          {/* KPI Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-white shadow p-5">
              <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
              <div className="text-2xl font-semibold">
                {kpi.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-gray-400">
                {dayjs(startDate).format("DD MMM")} – {dayjs(endDate).format("DD MMM")} (inclusive)
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white shadow p-5">
              <div className="text-xs text-gray-500 mb-1">Net Profit Margin</div>
              <div className="text-2xl font-semibold">{kpi.netProfitMargin.toFixed(1)}%</div>
              <div className="text-[11px] text-gray-400">Revenue vs COGS</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white shadow p-5">
              <div className="text-xs text-gray-500 mb-1">Customer Satisfaction</div>
              <div className="text-2xl font-semibold">{kpi.csat.toFixed(0)}%</div>
              <div className="text-[11px] text-gray-400">Avg rating / 5</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white shadow p-5">
              <div className="text-xs text-gray-500 mb-1">Employee Performance</div>
              <div className="text-2xl font-semibold">{kpi.empScore.toFixed(0)}%</div>
              <div className="text-[11px] text-gray-400">Composite of 4 sub-scores</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white shadow p-5">
              <div className="text-xs text-gray-500 mb-1">Operational Efficiency</div>
              <div className="text-2xl font-semibold">{kpi.operationalEfficiency.toFixed(0)}%</div>
              <div className="text-[11px] text-gray-400">Completed Orders / Total</div>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white shadow p-5 xl:col-span-2 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Revenue vs. Expenses</h4>
                <span className="text-xs text-gray-500">
                  {dayjs(startDate).format("DD MMM")} – {dayjs(endDate).format("DD MMM")}
                </span>
              </div>
              {hasSeries ? (
                <SalesVsExpensesChart
                  data={revExpSeries.map((x) => ({
                    order_date: x.bucket,
                    sales: num(x.revenue),
                    expenses: num(x.expense),
                    profit: num(x.revenue) - num(x.expense),
                  }))}
                />
              ) : (
                <EmptyState hint="No activity for the selected period." />
              )}
            </div>

            <div className="rounded-2xl bg-white shadow p-5 border border-gray-100">
              <h4 className="text-lg font-semibold mb-2">Profit Margins by Category</h4>
              <ProfitMarginByCategoryBar data={profitByCat} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white shadow p-5 border border-gray-100">
              <h4 className="text-lg font-semibold mb-2">Employee Performance (Radar)</h4>
              <EmployeePerformanceRadar data={empPerf} />
            </div>

            <div className="rounded-2xl bg-white shadow p-5 xl:col-span-2 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Financial Reports</h4>
                <div className="text-xs text-gray-500">
                  {dayjs(startDate).format("DD MMM")} – {dayjs(endDate).format("DD MMM")}
                </div>
              </div>
              <FinancialReportsTable data={financials} />
            </div>
          </div>

          {/* Detailed Reports */}
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white shadow p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Customer Feedback</h4>
                <button
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                  onClick={() =>
                    exportCSV(`customer_feedback_${startDate}_${endDate}.csv`, feedback, [
                      { key: "created_at", header: "Date" },
                      { key: "customer_name", header: "Customer" },
                      { key: "rating", header: "Rating" },
                      { key: "review_result", header: "Sentiment" },
                      { key: "review", header: "Review" },
                    ])
                  }
                >
                  Export CSV
                </button>
              </div>
              <CustomerFeedbackList rows={feedback} />
            </div>

            <div className="rounded-2xl bg-white shadow p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Employee Performance Details</h4>
                <button
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                  onClick={() =>
                    exportCSV(`employee_performance_${startDate}_${endDate}.csv`, empPerf, [
                      { key: "employee_name", header: "Employee" },
                      { key: "service", header: "Service" },
                      { key: "punctuality", header: "Punctuality" },
                      { key: "customerCare", header: "Customer Care" },
                      { key: "managerFeedback", header: "Manager Feedback" },
                      { key: "rating", header: "Overall Rating" },
                    ])
                  }
                >
                  Export CSV
                </button>
              </div>
              <EmployeePerformanceTable rows={empPerf} />
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
