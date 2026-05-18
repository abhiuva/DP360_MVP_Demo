// src/services/inventoryApi.js
import { API } from "../config/config";

const buildUrl = (path) => new URL(`${API}${path}`);

// GET inventory items (optionally filter by ?from=YYYY-MM-DD&to=YYYY-MM-DD)
export async function getInventoryItems({ from, to } = {}) {
  const url = buildUrl("/inventory-items");
  if (from) url.searchParams.set("from", from);
  if (to)   url.searchParams.set("to", to);
  const r = await fetch(url.toString(), { credentials: "include" });
  if (!r.ok) throw new Error("Failed to load inventory items");
  const data = await r.json();
  // shape from inventory_items: id, title, supplier_name, category, quantity,
  // last_ordered_date, tenant_id, image, inventory_changed_time, stock_alert_quantity. :contentReference[oaicite:0]{index=0}
  return Array.isArray(data) ? data : (data?.items || []);
}

// GET menu items mapped to an inventory_id to infer value (unit price)
export async function getMenuItemsByInventory(inventoryId) {
  const url = buildUrl("/menu-items");
  url.searchParams.set("inventory_id", inventoryId);
  const r = await fetch(url.toString(), { credentials: "include" });
  if (!r.ok) return [];
  const data = await r.json();
  // menu_items has price and net_price; prefer net_price. :contentReference[oaicite:1]{index=1}
  return Array.isArray(data) ? data : (data?.items || []);
}

// GET usage series (optional). Returns [{date:'YYYY-MM-DD', usage:number}]
export async function getInventoryUsageSeries({ from, to } = {}) {
  try {
    const url = buildUrl("/reports/inventory-usage");
    if (from) url.searchParams.set("from", from);
    if (to)   url.searchParams.set("to", to);
    const r = await fetch(url.toString(), { credentials: "include" });
    if (!r.ok) return [];
    const data = await r.json();
    return Array.isArray(data) ? data : (data?.series || []);
  } catch {
    return [];
  }
}

// PUT: inline update of inventory quantity
export async function updateInventoryQuantity(id, quantity) {
  try {
    const r = await fetch(buildUrl(`/inventory-items/update/${id}`).toString(), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    return r.ok;
  } catch {
    return false;
  }
}
