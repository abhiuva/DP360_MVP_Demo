import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import Page from "../../components/Page";
import dayjs from "dayjs";

// ── Controllers (unchanged) ────────────────────────────────────────────────────
import { getPurchaseReport } from "../../controllers/reports.controller";
import {
  getAllInventoryItems,
  getLowStockAlertsFromItems,
} from "../../controllers/inventory.controller";
import { useCategories } from "../../controllers/settings.controller"; // NEW: pull real categories from DB

// ── Existing local components (unchanged) ──────────────────────────────────────
import InventoryKPIs from "./components/InventoryKPIs";
import PurchaseTrendChart from "./components/PurchaseTrendChart";
import PurchaseBreakdown from "./components/PurchaseBreakdown";
import StockAlertTable from "./components/StockAlertTable";

// ── Charts (Recharts) ─────────────────────────────────────────────────────────
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ---------- Constants / Utils ----------
const PERIODS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

function toArray(maybe) {
  if (Array.isArray(maybe)) return maybe;
  if (maybe?.data && Array.isArray(maybe.data)) return maybe.data;
  return [];
}

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

function formatGBP(v) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(v || 0));
}

// NOTE: kept for backwards-compat but no longer used for filtering/aggregation
function bucketCategory(cat) {
  if (!cat && cat !== 0) return "Supplies/Other";
  const s = String(cat).toLowerCase();
  if (!/^\d+$/.test(s)) {
    if (
      s.includes("drink") ||
      s.includes("beverage") ||
      s.includes("juice") ||
      s.includes("soft")
    )
      return "Beverages";
    if (
      s.includes("food") ||
      s.includes("biryani") ||
      s.includes("sandwich") ||
      s.includes("salad") ||
      s.includes("soup") ||
      s.includes("appetizer") ||
      s.includes("breakfast") ||
      s.includes("meal")
    )
      return "Food";
    return "Supplies/Other";
  }
  const n = Number(cat);
  if ([5, 9].includes(n)) return "Beverages";
  if ([6, 14, 15, 16, 17, 7, 8, 13, 18].includes(n)) return "Food";
  return "Supplies/Other";
}

function extractUnitValueMaybe(item) {
  const candidates = [
    item?.unit_price,
    item?.cost_price,
    item?.purchase_price,
    item?.avg_cost,
    item?.price,
    item?.net_price,
  ];
  const value = candidates.find((x) => Number(x) > 0);
  return Number(value || 0);
}

function readPurchaseDatumAsUsagePoint(d) {
  const candidates = [
    d?.quantity,
    d?.qty,
    d?.total_quantity,
    d?.items,
    d?.units,
    d?.amount,
    d?.total,
    d?.net,
    d?.gross,
  ];
  const v = candidates.find((x) => typeof x === "number");
  return Number(v || 0);
}

// ---------- Small UI Atoms (for cohesive layout) ----------
const ShellCard = ({ title, subtitle, right, children, className = "" }) => (
  <section
    className={`rounded-2xl bg-white border border-gray-100 shadow-sm ${className}`}
  >
    {(title || subtitle || right) && (
      <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          {title && <h4 className="text-lg font-semibold">{title}</h4>}
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
        {right}
      </header>
    )}
    <div className="p-5">{children}</div>
  </section>
);

const Badge = ({ tone = "neutral", children }) => {
  const tones = {
    neutral: "bg-gray-100 text-gray-700",
    success: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        tones[tone] || tones.neutral
      }`}
    >
      {children}
    </span>
  );
};

const Divider = () => <hr className="my-4 border-gray-100" />;

// ---------- Page ----------
export default function InventoryDashboardReactPage() {
  // default: last 30 days, inclusive
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState(
    dayjs().subtract(29, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [quickRange, setQuickRange] = useState("30d"); // "7d" | "30d" | "q" | "ytd"

  const tenantId = getTenantIdSafely();

  const [inventoryItems, setInventoryItems] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [purchaseSeries, setPurchaseSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // ── Category state (DB-driven) ──────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState("ALL"); // "ALL" | "UNCAT" | <categoryId>

  // Pull categories from Settings (tenant-scoped)
  const { data: categoriesData, isLoading: catsLoading, error: catsError } =
    useCategories?.() || { data: [], isLoading: false, error: null };

  const categories = useMemo(() => {
    if (Array.isArray(categoriesData)) return categoriesData;
    if (categoriesData?.data && Array.isArray(categoriesData.data))
      return categoriesData.data;
    return [];
  }, [categoriesData]);

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((c) => [Number(c.id), c])),
    [categories]
  );

  const categoryNameFor = useCallback(
    (catId) => {
      const idNum = Number(catId);
      return categoriesById[idNum]?.title || "Uncategorized";
    },
    [categoriesById]
  );

  // ── Fetch data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [alerts, purchases, items] = await Promise.all([
          getLowStockAlertsFromItems({ tenantId }),
          getPurchaseReport(period, startDate, endDate, { tenantId }),
          getAllInventoryItems({ tenantId }),
        ]);

        if (!alive) return;
        setStockAlerts(toArray(alerts));
        setPurchaseSeries(toArray(purchases));
        setInventoryItems(toArray(items));
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load inventory dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tenantId, period, startDate, endDate]);

  // KPIs (existing)
  const kpi = useMemo(() => {
    const items = Array.isArray(inventoryItems) ? inventoryItems : [];
    const totalSKUs = items.length;
    const totalQty = items.reduce(
      (s, it) => s + (Number(it?.quantity) || 0),
      0
    );
    const suppliers = new Set(
      items.map((i) => i?.supplier_name).filter(Boolean)
    ).size;
    const lowStock = (Array.isArray(stockAlerts) ? stockAlerts : []).filter(
      (r) => Number(r?.quantity) <= Number(r?.stock_alert_quantity ?? -Infinity)
    ).length;
    return { totalSKUs, totalQty, suppliers, lowStock };
  }, [inventoryItems, stockAlerts]);

  // Quick ranges (existing)
  function applyQuickRange(preset) {
    setQuickRange(preset);
    const today = dayjs();
    if (preset === "7d") {
      setStartDate(today.subtract(6, "day").format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
      setPeriod("daily");
    } else if (preset === "30d") {
      setStartDate(today.subtract(29, "day").format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
      setPeriod("daily");
    } else if (preset === "q") {
      const qStart = today.startOf("quarter");
      setStartDate(qStart.format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
      setPeriod("weekly");
    } else if (preset === "ytd") {
      setStartDate(today.startOf("year").format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
      setPeriod("monthly");
    }
  }

  const rangeInvalid = dayjs(startDate).isAfter(dayjs(endDate));

  // ── Enhanced data views (DB categories) ─────────────────────────────────────
  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const s = String(search).trim().toLowerCase();
    const list = Array.isArray(inventoryItems) ? inventoryItems : [];
    return list.filter((it) => {
      const catOk =
        selectedCategory === "ALL"
          ? true
          : selectedCategory === "UNCAT"
          ? it?.category == null || Number(it?.category) === 0
          : Number(it?.category) === Number(selectedCategory);

      const searchOk = !s
        ? true
        : `${it?.title ?? ""} ${it?.supplier_name ?? ""}`
            .toLowerCase()
            .includes(s);
      return catOk && searchOk;
    });
  }, [inventoryItems, selectedCategory, search]);

  const levelsByCategory = useMemo(() => {
    const out = new Map();
    filteredItems.forEach((it) => {
      const k = categoryNameFor(it?.category);
      out.set(k, (out.get(k) || 0) + Number(it?.quantity || 0));
    });
    return [...out.entries()].map(([name, quantity]) => ({ name, quantity }));
  }, [filteredItems, categoryNameFor]);

  const valueDistribution = useMemo(() => {
    const out = new Map();
    filteredItems.forEach((it) => {
      const k = categoryNameFor(it?.category);
      const unit = extractUnitValueMaybe(it);
      const value = Number(it?.quantity || 0) * unit;
      const val = value > 0 ? value : Number(it?.quantity || 0);
      out.set(k, (out.get(k) || 0) + val);
    });
    const total = [...out.values()].reduce((a, b) => a + b, 0) || 1;
    return [...out.entries()].map(([name, value]) => ({
      name,
      value,
      pct: +((100 * value) / total).toFixed(1),
    }));
  }, [filteredItems, categoryNameFor]);

  const usageTrendData = useMemo(() => {
    const arr = Array.isArray(purchaseSeries) ? purchaseSeries : [];
    return arr
      .map((d) => ({
        date: d?.date || d?.day || d?.period || d?.label || "",
        usage: readPurchaseDatumAsUsagePoint(d),
      }))
      .filter((x) => x.date);
  }, [purchaseSeries]);

  const lowStockRows = useMemo(
    () => (Array.isArray(stockAlerts) ? stockAlerts : []),
    [stockAlerts]
  );

  const topInventoryRows = useMemo(() => {
    const list = Array.isArray(inventoryItems) ? inventoryItems : [];
    return [...list]
      .sort((a, b) => (Number(b?.quantity) || 0) - (Number(a?.quantity) || 0))
      .slice(0, 20)
      .map((x) => ({
        title: x?.title,
        quantity: x?.quantity,
        stock_alert_quantity: x?.stock_alert_quantity ?? "-",
      }));
  }, [inventoryItems]);

  const onBarcodeDetect = useCallback((code) => {
    setSearch(String(code || "").trim());
    setScannerOpen(false);
  }, []);

  // ---------- RENDER ----------
  return (
    <Page>
      {/* Sticky header bar */}
      <div className="sticky top-0 z-20 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-3 max-w-[1400px] mx-auto">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">
              Inventory Dashboard
            </h3>
            <div className="text-xs text-gray-500">
              {tenantId ? (
                <>
                  Tenant: <span className="font-medium">{tenantId}</span>
                </>
              ) : (
                "Tenant: current session"
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['7d', '30d', 'q', 'ytd'].map((key) => (
              <button
                key={key}
                className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                  quickRange === key
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => applyQuickRange(key)}
              >
                {key === '7d' ? '7D' : key === '30d' ? '30D' : key === 'q' ? 'Quarter' : 'YTD'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <ShellCard
        className="mt-4"
        title="Filters"
        subtitle="Inclusive date range"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm w-20">Period</label>
            <select
              className="border rounded-lg px-3 py-2 text-sm w-full"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm w-20">From</label>
            <input
              type="date"
              className="border rounded-lg px-3 py-2 text-sm w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm w-20">To</label>
            <input
              type="date"
              className="border rounded-lg px-3 py-2 text-sm w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <div
              className={`text-sm ${
                dayjs(startDate).isAfter(dayjs(endDate))
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
            >
              {dayjs(startDate).isAfter(dayjs(endDate))
                ? 'End date must be on/after start date'
                : 'Range is inclusive'}
            </div>
          </div>

          {/* Local filters */}
          <div className="flex items-center gap-2">
            <label className="text-sm w-20">Category</label>
            <select
              className="border rounded-lg px-3 py-2 text-sm w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              title="Filter by category (from DB)"
            >
              <option value="ALL">All categories</option>
              <option value="UNCAT">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm w-20">Search</label>
            <div className="relative w-full">
              <input
                className="border rounded-lg pl-9 pr-3 py-2 text-sm w-full"
                placeholder="Item or supplier…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔎</span>
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScannerOpen(true)}
            className="px-3 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90 transition"
            title="Scan a barcode to search"
          >
            Scan Barcode
          </button>
          <span className="text-xs text-gray-500">
            Use your camera to quickly find an item.
          </span>
          {catsLoading ? (
            <span className="text-xs text-gray-400 ml-auto">Loading categories…</span>
          ) : catsError ? (
            <span className="text-xs text-red-600 ml-auto">Failed to load categories</span>
          ) : (
            <span className="text-xs text-gray-400 ml-auto">{categories.length} categories</span>
          )}
        </div>
      </ShellCard>

      {/* Loading / Error */}
      {loading && (
        <ShellCard className="mt-4">
          <div className="animate-pulse text-sm text-gray-500">Loading…</div>
        </ShellCard>
      )}
      {err && !loading && (
        <ShellCard className="mt-4">
          <div className="rounded-lg bg-red-50 text-red-700 border border-red-200 p-3 text-sm">
            {err}
          </div>
        </ShellCard>
      )}

      {/* Content */}
      {!loading && !err && (
        <>
          {/* KPIs row (existing component but now framed) */}
          <ShellCard
            className="mt-4"
            title="Key Metrics"
            subtitle={`${dayjs(startDate).format("DD MMM YYYY")} – ${dayjs(
              endDate
            ).format("DD MMM YYYY")}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InventoryKPIs
                kpi={kpi}
                labels={{
                  totalSKUs: "Total Items",
                  totalQty: "Total Quantity",
                  suppliers: "Suppliers",
                  lowStock: "Low Stock",
                }}
              />
            </div>
          </ShellCard>

          {/* Row: Trend + Breakdown (existing) */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ShellCard
              className="lg:col-span-2"
              title={`Purchase Trend (${period})`}
              right={
                <Badge tone="neutral">
                  {formatDateSpan(startDate, endDate)}
                </Badge>
              }
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {/* Keep your existing chart by embedding it */}
                  <PurchaseTrendChart data={purchaseSeries} />
                </ResponsiveContainer>
              </div>
            </ShellCard>

            <ShellCard
              title={`Paid vs Due (${period})`}
              subtitle="Breakdown for the selected period"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {/* Keep your existing chart */}
                  <PurchaseBreakdown data={purchaseSeries} />
                </ResponsiveContainer>
              </div>
            </ShellCard>
          </div>

          {/* Row: New Charts */}
          <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-6">
            <ShellCard
              title="Inventory Levels by Category"
              subtitle="Current quantity by category"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={levelsByCategory}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ShellCard>

            <ShellCard
              title="Stock Usage Trend"
              subtitle="Derived from the purchase series"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageTrendData}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ShellCard>

            <ShellCard
              title="Inventory Value Distribution"
              subtitle="Uses unit/cost price if available; falls back to quantity weights"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={valueDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="58%"
                      outerRadius="82%"
                      paddingAngle={2}
                    >
                      {valueDistribution.map((_, i) => (
                        <Cell key={i} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, n, p) => [
                        `${formatGBP(v)} (${p?.payload?.pct ?? 0}%)`,
                        p?.payload?.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ShellCard>
          </div>

          {/* Row: Alerts + Top Inventory (existing tables, improved framing) */}
          <div className="mt-4">
            <ShellCard
              title="Low Stock Alerts"
              subtitle="Items at or below reorder levels"
            >
              <StockAlertTable rows={lowStockRows} />
            </ShellCard>
          </div>

          {/* All Inventory — full width below */}
          <div className="mt-4">
            <ShellCard
              title="All Inventory (Top 20 by Qty)"
              subtitle="Highest on-hand quantities"
            >
              <StockAlertTable rows={topInventoryRows} hideAlertColor />
            </ShellCard>
          </div>

          {/* Inventory Details (expanded, searchable, color-coded) */}
          <ShellCard
            className="mt-4"
            title="Inventory Details"
            subtitle={`${filteredItems.length} items shown`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 pr-3">Item</th>
                    <th className="py-2 pr-3">Category</th>
                    <th className="py-2 pr-3">Current Stock</th>
                    <th className="py-2 pr-3">Reorder Level</th>
                    <th className="py-2 pr-3">Supplier</th>
                    <th className="py-2 pr-3">Last Ordered</th>
                    <th className="py-2 pr-3">Est. Unit Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((it) => {
                    const isLow =
                      Number(it?.stock_alert_quantity ?? 0) > 0 &&
                      Number(it?.quantity) <= Number(it?.stock_alert_quantity);
                    const catName = categoryNameFor(it?.category);
                    const unitVal = extractUnitValueMaybe(it);
                    return (
                      <tr
                        key={it?.id ?? `${it?.title}-${it?.supplier_name}`}
                        className="border-b last:border-b-0"
                      >
                        <td className="py-2 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {it?.title || "—"}
                            </span>
                            <Badge tone={isLow ? "danger" : "success"}>
                              {isLow ? "LOW" : "OK"}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-2 pr-3">{catName}</td>
                        <td className="py-2 pr-3">{Number(it?.quantity ?? 0)}</td>
                        <td className="py-2 pr-3">
                          {it?.stock_alert_quantity ?? "—"}
                        </td>
                        <td className="py-2 pr-3">{it?.supplier_name || "—"}</td>
                        <td className="py-2 pr-3">
                          {it?.last_ordered_date
                            ? dayjs(it.last_ordered_date).format("DD MMM YYYY")
                            : "—"}
                        </td>
                        <td className="py-2 pr-3">
                          {unitVal > 0 ? formatGBP(unitVal) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-6 text-center text-gray-500">
                        No items match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ShellCard>
        </>
      )}

      {/* Barcode Scanner Modal (lazy import for faster load) */}
      {scannerOpen && (
        <BarcodeScannerModal
          onClose={() => setScannerOpen(false)}
          onDetect={onBarcodeDetect}
        />
      )}
    </Page>
  );
}

// ---------- Helpers ----------
function formatDateSpan(from, to) {
  return `${dayjs(from).format("DD MMM YYYY")} – ${dayjs(to).format(
    "DD MMM YYYY"
  )}`;
}

// Inline, self-contained scanner (no extra files)
function BarcodeScannerModal({ onClose, onDetect }) {
  const videoRef = useRef(null);
  const quaggaRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const Quagga = (await import("@ericblade/quagga2")).default;
        quaggaRef.current = Quagga;

        await Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: videoRef.current,
              constraints: { facingMode: "environment" },
            },
            decoder: {
              readers: [
                "ean_reader",
                "ean_8_reader",
                "upc_reader",
                "code_128_reader",
              ],
            },
            locate: true,
          },
          (err) => {
            if (err) {
              setError(err?.message || "Camera init failed");
              return;
            }
            if (mounted) Quagga.start();
          }
        );

        Quagga.onDetected((res) => {
          const code = res?.codeResult?.code;
          if (code) {
            try {
              Quagga.stop();
            } catch {}
            if (mounted) onDetect && onDetect(code);
          }
        });
      } catch (e) {
        setError(e?.message || "Scanner failed to load");
      }
    })();

    return () => {
      mounted = false;
      try {
        quaggaRef.current?.stop();
      } catch {}
      try {
        quaggaRef.current?.offDetected?.();
      } catch {}
    };
  }, [onDetect]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-[min(92vw,720px)]">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="font-medium">Barcode Scanner</div>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-lg border"
          >
            Close
          </button>
        </div>
        <div className="p-5">
          {error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">
                Point your camera at the barcode. When detected, the code will
                be used to filter the list automatically.
              </p>
              <div className="w-full aspect-video rounded-xl overflow-hidden border">
                <div ref={videoRef} style={{ width: "100%", height: "100%" }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
