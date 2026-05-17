import ApiClient from "../helpers/ApiClient";
import useSWR from "swr";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);


export function useInventoryItems() {
    const APIURL = `/inventory-items`;
    const { data, error, isLoading } = useSWR(APIURL, fetcher);
    return {
        data,
        error,
        isLoading,
        APIURL,
    };
}

export function useInventoryItem(id) {
    const APIURL = `/inventory-items/${id}`;
    const { data, error, isLoading } = useSWR(APIURL, fetcher);
    return {
        data,
        error,
        isLoading,
        APIURL,
    };
}

export async function addInventoryItem(title, categoryId, quantity, supplier_name, stock_alert_quantity) {
    try {
        const response = await ApiClient.post("/inventory-items/add", {
            title,
            categoryId,
            quantity,
            supplier_name,
            stock_alert_quantity,
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function updateInventoryItem(id, title, categoryId, quantity, supplier_name, stock_alert_quantity) {
    try {
        const response = await ApiClient.post(`/inventory-items/update/${id}`, {
            title,
            categoryId,
            quantity,
            supplier_name,
            stock_alert_quantity,
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function uploadInventoryItemPhoto(id, form) {
    try {
        const response = await ApiClient.post(`/inventory-items/update/${id}/upload-photo`, form);
        return response;
    } catch (error) {
        throw error;
    }
}
export async function removeInventoryItemPhoto(id) {
    try {
        const response = await ApiClient.post(`/inventory-items/update/${id}/remove-photo`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function deleteInventoryItem(id) {
    try {
        const response = await ApiClient.delete(`/inventory-items/delete/${id}`)
        return response;
    } catch (error) {
        throw error;
    }
};

export function useInventoryUnits() {
  const APIURL = `/inventory-items/units/list`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export function useRecipeByMenuItem(menuItemId) {
  const APIURL = menuItemId ? `/inventory-items/recipes/menu-item/${menuItemId}` : null;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export async function getRecipeByMenuItem(menuItemId) {
  const res = await ApiClient.get(`/inventory-items/recipes/menu-item/${menuItemId}`);
  return res.data;
}

export async function saveRecipe(payload) {
  const res = await ApiClient.post(`/inventory-items/recipes`, payload);
  return res;
}

export async function deleteRecipe(recipeId) {
  const res = await ApiClient.delete(`/inventory-items/recipes/${recipeId}`);
  return res;
}

export async function adjustInventoryStock(payload) {
  const res = await ApiClient.post(`/inventory-items/adjustments`, payload);
  return res;
}

export async function receivePurchase(payload) {
  const res = await ApiClient.post(`/inventory-items/purchase-receipts`, payload);
  return res;
}


export async function getAllInventoryItems({ tenantId } = {}) {
  const params = {};
  if (tenantId) params.tenant_id = tenantId; // harmless if backend ignores
  const res = await ApiClient.get(`/inventory-items`, { params });
  return res.data; // array or {data: array}
}

// ► NEW: derive low-stock from inventory items (no backend /reports call needed)
export async function getLowStockAlertsFromItems({ tenantId } = {}) {
  const raw = await getAllInventoryItems({ tenantId });
  const items = Array.isArray(raw) ? raw : raw?.data ?? [];
  return items
    .filter((it) => {
      const qty = Number(it?.quantity ?? NaN);
      const alert = Number(it?.stock_alert_quantity ?? NaN);
      return Number.isFinite(qty) && Number.isFinite(alert) && alert >= 0 && qty <= alert;
    })
    .map((it) => ({
      title: it?.title ?? "-",
      quantity: Number(it?.quantity ?? 0),
      stock_alert_quantity: Number(it?.stock_alert_quantity ?? 0),
    }));
}
