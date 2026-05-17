import React, { useMemo } from "react";
import { IconX } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";

export default function DashboardSettingsDrawer({
  isOpen,
  widgets,
  selectedWidgetKeys,
  onToggleWidget,
  onClose,
}) {
  const groupedWidgets = useMemo(() => {
    return widgets.reduce((acc, widget) => {
      const category = widget.category || "Other";
      acc[category] = acc[category] || [];
      acc[category].push(widget);
      return acc;
    }, {});
  }, [widgets]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-gray-950/30 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Dashboard Widgets</h2>
              <p className="text-xs text-gray-500 mt-1">Choose the KPIs visible on this dashboard.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
              aria-label="Close dashboard settings"
            >
              <IconX size={20} stroke={iconStroke} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {Object.entries(groupedWidgets).map(([category, items]) => (
              <section key={category}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  {category}
                </h3>
                <div className="divide-y border rounded-lg">
                  {items.map((widget) => {
                    const checked = selectedWidgetKeys.includes(widget.widgetKey);
                    return (
                      <label
                        key={widget.widgetKey}
                        className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleWidget(widget.widgetKey)}
                          className="w-4 h-4 accent-salespos-green"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">{widget.title}</p>
                          <p className="text-xs text-gray-500">{widget.visualization.replace("_", " ")}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
