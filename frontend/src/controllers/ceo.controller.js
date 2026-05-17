// ✅ Use your shared axios instance
import ApiClient from "../helpers/ApiClient";

/** Revenue vs Expenses (time series) */
export async function ceoGetRevenueExpenses({ tenantId, period, from, to }) {
  const { data } = await ApiClient.get(`/ceo/revenue-expenses`, {
    params: { tenantId, period, from, to },
  });
  return Array.isArray(data) ? data : data?.data || [];
}

/** Profit Margins by Category */
export async function ceoGetProfitMarginsByCategory({ tenantId, from, to }) {
  const { data } = await ApiClient.get(`/ceo/profit-margins`, {
    params: { tenantId, from, to },
  });
  return Array.isArray(data) ? data : data?.data || [];
}

/** Employee Performance (detailed + for radar) */
export async function ceoGetEmployeePerformance({ tenantId }) {
  const { data } = await ApiClient.get(`/ceo/employee-performance`, {
    params: { tenantId },
  });
  return Array.isArray(data) ? data : data?.data || [];
}

/** Financial Summaries (monthly/quarterly/yearly) */
export async function ceoGetFinancialSummaries({ tenantId, from, to }) {
  const { data } = await ApiClient.get(`/ceo/financial-summaries`, {
    params: { tenantId, from, to },
  });
  return data || { monthly: [], quarterly: [], yearly: [] };
}

/** Customer Feedback (detailed list) */
export async function ceoGetCustomerFeedback({ tenantId, from, to }) {
  const { data } = await ApiClient.get(`/ceo/customer-feedback`, {
    params: { tenantId, from, to },
  });
  return Array.isArray(data) ? data : data?.data || [];
}

/** Operational Efficiency (completed/total) */
export async function ceoGetOperationalEfficiency({ tenantId, from, to }) {
  const { data } = await ApiClient.get(`/ceo/operational-efficiency`, {
    params: { tenantId, from, to },
  });
  return data || { completed: 0, total: 0, efficiencyPercent: 0 };
}
