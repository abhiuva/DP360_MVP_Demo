import ApiClient from "../helpers/ApiClient";
import useSWR from "swr";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);

export function useDashboard() {
  const APIURL = `/dashboard`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export function useDashboardEngine() {
  const APIURL = `/dashboard/engine`;
  const { data, error, isLoading, mutate } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    mutate,
    APIURL,
  };
}

export async function getDashboardWidgetData(widgetKeys = []) {
  const params = {};
  if (widgetKeys.length > 0) {
    params.widgetKeys = widgetKeys.join(",");
  }

  const res = await ApiClient.get(`/dashboard/widget-data`, { params });
  return res.data;
}

export async function saveDashboardPreferences(selectedWidgetKeys, layout) {
  const res = await ApiClient.put(`/dashboard/preferences`, {
    selectedWidgetKeys,
    layout,
  });
  return res;
}
