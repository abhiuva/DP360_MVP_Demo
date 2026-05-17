import React, { useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { IconGripVertical } from "@tabler/icons-react";
import WidgetRenderer from "./WidgetRenderer";
import { iconStroke } from "../../config/config";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./dashboard-grid.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

function toGridItem(widget, savedLayout) {
  const base = savedLayout || widget.defaultLayout || { x: 0, y: 0, w: 4, h: 3 };
  return {
    i: widget.widgetKey,
    x: Number(base.x ?? 0),
    y: Number(base.y ?? 0),
    w: Number(base.w ?? 4),
    h: Number(base.h ?? 3),
    minW: Number(base.minW ?? 2),
    minH: Number(base.minH ?? 2),
  };
}

export default function DashboardGrid({
  widgets,
  selectedWidgetKeys,
  layout,
  data,
  currencySymbol,
  onLayoutChange,
}) {
  const selectedWidgets = useMemo(() => {
    return widgets.filter((widget) => selectedWidgetKeys.includes(widget.widgetKey));
  }, [widgets, selectedWidgetKeys]);

  const layouts = useMemo(() => {
    const lg = selectedWidgets.map((widget) => toGridItem(widget, layout[widget.widgetKey]));
    return { lg, md: lg, sm: lg, xs: lg, xxs: lg };
  }, [selectedWidgets, layout]);

  if (selectedWidgets.length === 0) {
    return (
      <div className="border border-dashed rounded-lg min-h-[280px] flex items-center justify-center text-gray-500">
        Select widgets from settings to build this dashboard.
      </div>
    );
  }

  return (
    <ResponsiveGridLayout
      className="dp360-dashboard-grid"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={72}
      margin={[16, 16]}
      draggableHandle=".widget-drag-handle"
      onLayoutChange={(currentLayout) => {
        const nextLayout = currentLayout.reduce((acc, item) => {
          acc[item.i] = {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            minW: item.minW,
            minH: item.minH,
          };
          return acc;
        }, {});
        onLayoutChange(nextLayout);
      }}
    >
      {selectedWidgets.map((widget) => (
        <div key={widget.widgetKey} className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-950 truncate">{widget.title}</h3>
                {widget.config?.subtitle && (
                  <p className="text-xs text-gray-500 truncate">{widget.config.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                className="widget-drag-handle w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-grab active:cursor-grabbing"
                aria-label={`Move ${widget.title}`}
              >
                <IconGripVertical size={18} stroke={iconStroke} />
              </button>
            </div>
            <div className="flex-1 min-h-0 p-4">
              <WidgetRenderer
                widget={widget}
                payload={data[widget.widgetKey]}
                currencySymbol={currencySymbol}
              />
            </div>
          </div>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
