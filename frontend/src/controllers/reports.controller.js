import axios from "axios";
import ApiClient from "../helpers/ApiClient";
import useSWR from "swr";
import { API } from "../config/config";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);

// ---------- Small internal helpers (define ONCE) ----------
function getTenantIdFromSession() {
  try {
    // try various places your app might store it
    const t1 = localStorage.getItem("tenant_id");
    if (t1) return t1;
    const t2 = localStorage.getItem("tenantId");
    if (t2) return t2;
    const raw = localStorage.getItem("user");
    if (raw) {
      const obj = JSON.parse(raw);
      return obj?.tenant_id ?? obj?.tenantId ?? null;
    }
  } catch (_) {}
  return null;
}

function addOneDay(yyyy_mm_dd) {
  if (!yyyy_mm_dd) return yyyy_mm_dd;
  const d = new Date(`${yyyy_mm_dd}T00:00:00`);
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

// ---------- SWR hook (unchanged) ----------
export function useReports({ type, from = null, to = null }) {
  const APIURL = `/reports?type=${type}&from=${from}&to=${to}`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return { data, error, isLoading, APIURL };
}

// ---------- Your existing endpoints (unchanged) ----------
export async function getItemSaleReport(startDate = null, endDate = null) {
  try {
    const response = await axios.get(`${API}/reports/item-sale-report`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    return [];
  }
}

export async function getCustomerDueReport(startDate = null, endDate = null) {
  try {
    const response = await axios.get(`${API}/reports/customer-due-report`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    return [];
  }
}

export async function getSupplierDueReport(startDate = null, endDate = null) {
  try {
    const response = await axios.get(`${API}/reports/supplier-due-report`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    return [];
  }
}

export async function getEmployees() {
  try {
    const response = await axios.get(`${API}/reports/employees`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching employees", error);
    return [];
  }
}

export async function getAttendanceReport(
  employeeId,
  startDate = null,
  endDate = null
) {
  try {
    const response = await axios.get(`${API}/reports/attendance-report`, {
      params: { employeeId, startDate, endDate },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching attendance report", error);
    return [];
  }
}

export async function getExpenseReport(period, startDate, endDate) {
  try {
    const response = await axios.get(`${API}/reports/expense-report`, {
      params: { period, startDate, endDate },
    });
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching expense report:", error);
    return [];
  }
}

export async function getSalesReport(period, startDate, endDate) {
  try {
    const response = await axios.get(`${API}/reports/sales-report`, {
      params: { period, startDate, endDate },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    return null;
  }
}

/** STOCK ALERT — use ApiClient so auth gets sent; include tenant_id if known */
export async function getStockAlertReport(opts = undefined) {
  try {
    const explicitTenant =
      typeof opts === "object" ? opts?.tenantId : undefined;
    const tenantId = explicitTenant ?? getTenantIdFromSession();
    const params = {};
    if (tenantId) params.tenant_id = tenantId;

    // IMPORTANT: use ApiClient (not axios) so Authorization / cookies are included
    const response = await ApiClient.get(`/reports/stock-alert`, { params });
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching stock alert report", error);
    return [];
  }
}

/** PURCHASE REPORT — also use ApiClient; backend is already inclusive to 23:59:59 */
export async function getPurchaseReport(
  period,
  startDate,
  endDate,
  options = undefined
) {
  try {
    const opt = options || {};
    const tenantId = opt.tenantId ?? getTenantIdFromSession();

    const params = { period, startDate, endDate }; // do NOT add +1 day (backend inclusive)
    if (tenantId) params.tenant_id = tenantId;

    // IMPORTANT: use ApiClient (not axios)
    const response = await ApiClient.get(`/reports/purchase-report`, {
      params,
    });
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching purchasereport:", error);
    return [];
  }
}

export async function getWorkPeriodReport(startDate = null, endDate = null) {
  try {
    const response = await axios.get(`${API}/reports/work-period-report`, {
      params: { startDate, endDate },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching work period report:", error);
    return [];
  }
}

export async function getSaleSummaryReport(startDate = null, endDate = null) {
  try {
    const response = await axios.get(`${API}/reports/sale-summary-report`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sale summary report", error);
    return [];
  }
}

export async function getSaleDetailedReport(startDate = null, endDate = null) {
  try {
    const response = await axios.get(`${API}/reports/sale-detailed-report`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sale detailed report", error);
    return [];
  }
}

export async function getEmployeePerformance() {
  try {
    const response = await axios.get(`${API}/reports/employee-performance`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee performance:", error);
    return [];
  }
}
