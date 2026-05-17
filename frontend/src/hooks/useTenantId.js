import { useEffect, useState } from 'react';

const useTenantId = () => {
  try {
    const userData = localStorage.getItem('salespulsesaas_user');
    if (!userData) return null;

    const parsed = JSON.parse(userData);
    return parsed.tenant_id || null;
  } catch (e) {
    console.error("Failed to parse tenant_id:", e);
    return null;
  }
};

export default useTenantId;
