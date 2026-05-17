import React, { useEffect, useMemo, useState } from "react";
import Page from "../components/Page";
import { IconRefresh, IconSettings } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { CURRENCIES } from "../config/currencies.config";
import { iconStroke } from "../config/config";
import {
  getDashboardWidgetData,
  saveDashboardPreferences,
  useDashboardEngine,
} from "../controllers/dashboard.controller";
import DashboardGrid from "./DashboardEngine/DashboardGrid";
import DashboardSettingsDrawer from "./DashboardEngine/DashboardSettingsDrawer";

function normalizeSelection(widgets, preferences) {
  const availableKeys = new Set(widgets.map((widget) => widget.widgetKey));
  return (preferences?.selectedWidgetKeys || []).filter((key) => availableKeys.has(key));
}

export default function DashboardPage() {
  const { data: engine, error, isLoading, mutate } = useDashboardEngine();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedWidgetKeys, setSelectedWidgetKeys] = useState([]);
  const [layout, setLayout] = useState({});
  const [widgetData, setWidgetData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const widgets = engine?.widgets || [];
  const currency = useMemo(() => {
    return CURRENCIES.find((item) => item.cc === engine?.currency) || { symbol: "₹" };
  }, [engine?.currency]);

  useEffect(() => {
    if (!engine) return;
    setSelectedWidgetKeys(normalizeSelection(engine.widgets || [], engine.preferences));
    setLayout(engine.preferences?.layout || {});
    setWidgetData(engine.data || {});
  }, [engine]);

  async function persistPreferences(nextSelectedWidgetKeys, nextLayout) {
    try {
      setIsSaving(true);
      await saveDashboardPreferences(nextSelectedWidgetKeys, nextLayout);
      await mutate();
    } catch (err) {
      console.error(err);
      toast.error("Unable to save dashboard preferences.");
    } finally {
      setIsSaving(false);
    }
  }

  async function refreshData(keys = selectedWidgetKeys) {
    try {
      const nextData = await getDashboardWidgetData(keys);
      setWidgetData(nextData);
    } catch (err) {
      console.error(err);
      toast.error("Unable to refresh dashboard data.");
    }
  }

  async function handleToggleWidget(widgetKey) {
    const widget = widgets.find((item) => item.widgetKey === widgetKey);
    const nextSelected = selectedWidgetKeys.includes(widgetKey)
      ? selectedWidgetKeys.filter((key) => key !== widgetKey)
      : [...selectedWidgetKeys, widgetKey];

    const nextLayout = {
      ...layout,
      ...(widget && !layout[widgetKey] ? { [widgetKey]: widget.defaultLayout } : {}),
    };

    setSelectedWidgetKeys(nextSelected);
    setLayout(nextLayout);

    if (!selectedWidgetKeys.includes(widgetKey)) {
      await refreshData(nextSelected);
    }
    await persistPreferences(nextSelected, nextLayout);
  }

  async function handleLayoutChange(nextLayout) {
    const mergedLayout = { ...layout, ...nextLayout };
    setLayout(mergedLayout);
    await persistPreferences(selectedWidgetKeys, mergedLayout);
  }

  if (isLoading) {
    return <Page>Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page>Error loading dashboard data. Please try later.</Page>;
  }

  return (
    <Page className="px-4 py-5 md:px-8 md:py-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">DP360 Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tenant-aware analytics built from configurable widgets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshData()}
            className="w-10 h-10 rounded-lg border bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600"
            aria-label="Refresh dashboard data"
          >
            <IconRefresh size={20} stroke={iconStroke} />
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-lg border bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600"
            aria-label="Open dashboard settings"
          >
            <IconSettings size={20} stroke={iconStroke} />
          </button>
        </div>
      </div>

      {isSaving && (
        <div className="mb-3 text-xs text-gray-500">Saving dashboard preferences...</div>
      )}

      <DashboardGrid
        widgets={widgets}
        selectedWidgetKeys={selectedWidgetKeys}
        layout={layout}
        data={widgetData}
        currencySymbol={currency.symbol}
        onLayoutChange={handleLayoutChange}
      />

      <DashboardSettingsDrawer
        isOpen={isSettingsOpen}
        widgets={widgets}
        selectedWidgetKeys={selectedWidgetKeys}
        onToggleWidget={handleToggleWidget}
        onClose={() => setIsSettingsOpen(false)}
      />
    </Page>
  );
}
