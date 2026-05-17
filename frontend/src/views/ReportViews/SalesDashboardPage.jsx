import React, { useEffect, useState } from "react";
import {
  getSalesSummary,
  getSalesByDay,
  getTopItems,
  getStockByCategory,
  getSalesByCategory,
  getSalesByPaymentMode,
  getSalesPerHour,
  getMonthlyRevenueStats,
} from "../../utils/api";

import useTenantId from "../../hooks/useTenantId";
import useStoreSettings from "../../hooks/useStoreSettings";

import SalesChart from "./components/SalesChart";
import TopItemsList from "./components/TopItemsList";
import StockByCategoryChart from "./components/StockByCategoryChart";
import SalesByCategoryChart from "./components/SalesByCategoryChart";
import SalesByPaymentMode from "./components/SalesByPaymentMode";
import SalesPerHourChart from "./components/SalesPerHourChart";
import MonthlyRevenueChart from "./components/MonthlyRevenueChart";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

const overlayComponents = {
  "Sales Chart": SalesChart,
  "Top Items": TopItemsList,
  "Stock by Category": StockByCategoryChart,
  "Sales by Category": SalesByCategoryChart,
  "Sales by Payment Mode": SalesByPaymentMode,
  "Sales per Hour": SalesPerHourChart,
  "Monthly Revenue": MonthlyRevenueChart,
};

const SalesDashboardReactPage = () => {
  const tenantId = useTenantId();
  const storeSettings = useStoreSettings(tenantId);

  const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
  });
  const [data, setData] = useState({});
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [fullscreenTitle, setFullscreenTitle] = useState(null);
  const [fullscreenData, setFullscreenData] = useState(null);
  const [filters, setFilters] = useState({});

  const currencySymbol = getCurrencySymbol(storeSettings?.currency || "INR");

  function getCurrencySymbol(code) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .format(0)
        .replace(/\d/g, "")
        .trim();
    } catch {
      return code || "₹";
    }
  }

  const fetchData = async (customFilters = {}, forFullscreen = null) => {
    if (!tenantId) return;

    try {
      const summary = await getSalesSummary(tenantId, customFilters);
      setSalesSummary(summary);

      const fetchMap = {
        "Sales Chart": getSalesByDay,
        "Top Items": getTopItems,
        "Stock by Category": getStockByCategory,
        "Sales by Category": getSalesByCategory,
        "Sales by Payment Mode": getSalesByPaymentMode,
        "Sales per Hour": getSalesPerHour,
        "Monthly Revenue": getMonthlyRevenueStats,
      };

      const payload = {
        "Total Sales": { value: summary.totalSales },
        "Total Orders": { value: summary.totalOrders },
      };

      for (const title in fetchMap) {
        const data = await fetchMap[title](tenantId, customFilters);
        payload[title] = data;
      }

      setData(payload);

      // Load fullscreen data if needed
      if (forFullscreen && fetchMap[forFullscreen]) {
        const result = await fetchMap[forFullscreen](tenantId, customFilters);
        setFullscreenData(result);
      }
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  const handleApplyFilters = async (title) => {
    const filteredData = await getFilteredData(title, filters[title] || {});
    if (["Total Sales", "Total Orders"].includes(title)) {
      const updatedSummary = await getSalesSummary(tenantId, filters[title]);
      setSalesSummary(updatedSummary);
    } else {
      setFullscreenData(filteredData);
    }
  };

  const getFilteredData = async (title, customFilters = {}) => {
    const fetchMap = {
      "Sales Chart": getSalesByDay,
      "Top Items": getTopItems,
      "Stock by Category": getStockByCategory,
      "Sales by Category": getSalesByCategory,
      "Sales by Payment Mode": getSalesByPaymentMode,
      "Sales per Hour": getSalesPerHour,
      "Monthly Revenue": getMonthlyRevenueStats,
    };

    const func = fetchMap[title];
    return func ? await func(tenantId, customFilters) : null;
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return [...Array(5)].map((_, i) => {
      const y = currentYear - i;
      return (
        <option key={y} value={y}>
          {y}
        </option>
      );
    });
  };

  const reportList = [
    "Total Sales",
    "Total Orders",
    ...Object.keys(overlayComponents),
  ];

  const OverlayComponent = activeOverlay
    ? overlayComponents[activeOverlay]
    : null;

  const FullComponent = fullscreenTitle
    ? overlayComponents[fullscreenTitle]
    : null;

  return (
    <div className="relative p-6 md:p-10 bg-gradient-to-br from-white to-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
        Sales Dashboard
      </h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportList.map((title) => {
          const val = data[title];
          let value =
            val?.value ??
            (Array.isArray(val) ? val.length : val?.total || 0);

          if (
            title === "Monthly Revenue" &&
            Array.isArray(val) &&
            val.length > 0
          ) {
            value = val[val.length - 1].totalRevenue;
          }

          const handleClick = () => {
            if (["Total Sales", "Total Orders"].includes(title)) {
              setFullscreenTitle(title);
              setFilters((prev) => ({ ...prev, [title]: {} }));
            } else {
              setActiveOverlay(title);
            }
          };

          return (
            <Card
              key={title}
              onClick={handleClick}
              className="cursor-pointer bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 hover:scale-[1.02] transition duration-300"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-900">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">
                  {["Total Sales", "Monthly Revenue"].includes(title)
                    ? `${currencySymbol}${value}`
                    : value}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Click for full insights
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Overlay Dialog */}
      <Dialog
        open={!!activeOverlay}
        onOpenChange={(open) => {
          if (!open) {
            setActiveOverlay(null);
            setFilters((prev) => {
              const updated = { ...prev };
              delete updated[activeOverlay];
              return updated;
            });
          }
        }}
      >
        <DialogContent
          className="z-[99999] max-h-[90vh] w-full max-w-6xl bg-white p-6 rounded-xl shadow-2xl overflow-y-auto"
          hideClose
        >
          <DialogHeader className="mb-4 border-b pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {activeOverlay}
              </DialogTitle>
              <button
                onClick={() => setActiveOverlay(null)}
                className="text-sm"
              ></button>
            </div>
          </DialogHeader>

          {OverlayComponent && (
            <>
              <OverlayComponent
                data={data[activeOverlay]}
                currency={currencySymbol}
              />
              <div className="pt-6 flex justify-end">
                <button
                  onClick={async () => {
                    const result = await getFilteredData(
                      activeOverlay,
                      filters[activeOverlay]
                    );
                    setFullscreenTitle(activeOverlay);
                    setFullscreenData(result);
                    setActiveOverlay(null);
                  }}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  View Full Report
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen View for ALL Reports */}
      {fullscreenTitle && (
        <div className="fixed inset-0 bg-white z-[10000] p-10 overflow-y-auto shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-800">{fullscreenTitle}</h2>
            <button
              className="text-sm text-red-600 border px-3 py-1 rounded hover:bg-red-100"
              onClick={() => {
                setFullscreenTitle(null);
                setFullscreenData(null);
                setFilters((prev) => {
                  const updated = { ...prev };
                  delete updated[fullscreenTitle];
                  return updated;
                });
              }}
            >
              Close
            </button>
          </div>

          {/* Filters */}
          {fullscreenTitle !== "Stock by Category" && (
            <div className="mb-6 flex flex-wrap gap-4">
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={filters[fullscreenTitle]?.startDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [fullscreenTitle]: {
                      ...prev[fullscreenTitle],
                      startDate: e.target.value,
                    },
                  }))
                }
              />
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={filters[fullscreenTitle]?.endDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [fullscreenTitle]: {
                      ...prev[fullscreenTitle],
                      endDate: e.target.value,
                    },
                  }))
                }
              />
              <select
                className="border rounded px-3 py-2"
                value={filters[fullscreenTitle]?.month || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [fullscreenTitle]: {
                      ...prev[fullscreenTitle],
                      month: e.target.value,
                    },
                  }))
                }
              >
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
              <select
                className="border rounded px-3 py-2"
                value={filters[fullscreenTitle]?.year || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [fullscreenTitle]: {
                      ...prev[fullscreenTitle],
                      year: e.target.value,
                    },
                  }))
                }
              >
                <option value="">Year</option>
                {generateYearOptions()}
              </select>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleApplyFilters(fullscreenTitle)}
              >
                Apply Filters
              </button>
            </div>
          )}

          {/* Data/Chart */}
          <div className="mt-6">
            {fullscreenTitle === "Total Sales" ? (
              <div className="text-5xl font-extrabold text-blue-800 text-center">
                {currencySymbol}
                {salesSummary.totalSales}
              </div>
            ) : fullscreenTitle === "Total Orders" ? (
              <div className="text-5xl font-extrabold text-blue-800 text-center">
                {salesSummary.totalOrders}
              </div>
            ) : (
              FullComponent && (
                <FullComponent
                  data={fullscreenData}
                  currency={currencySymbol}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboardReactPage;
