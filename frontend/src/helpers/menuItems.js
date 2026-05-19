export const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.menuItems)) return value.menuItems;
  return [];
};

export const itemMatchesCategory = (item, selectedCategory) => {
  const category = String(selectedCategory || "all").toLowerCase();

  if (category === "all") {
    return true;
  }

  return String(item?.category_id ?? item?.category ?? "") === String(selectedCategory);
};

export const itemMatchesSearch = (item, searchQuery) => {
  if (!searchQuery) {
    return true;
  }

  return String(item?.title || "")
    .trim()
    .toLowerCase()
    .includes(searchQuery.trim().toLowerCase());
};
