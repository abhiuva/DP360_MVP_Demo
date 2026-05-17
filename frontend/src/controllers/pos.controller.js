import ApiClient from "../helpers/ApiClient";

const DRAFTS_KEY = "SALESPULSESAAS__DRAFTS";

export async function initPOS() {
    try {
      const response = await ApiClient.get("/pos/init");
      return response;
    } catch (error) {
      throw error;
    }
}

export async function createOrder(cart, deliveryType, customerType, customerId, tableId, selectedQrOrderItem) {
  try {
    const response = await ApiClient.post("/pos/create-order", {
      cart, deliveryType, customerType, customerId, tableId, selectedQrOrderItem
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createOrderAndInvoice(cart, deliveryType, customerType, customerId, tableId, netTotal, taxTotal, total, discount, selectedQrOrderItem, selectedPaymentType) {
  try {
    const response = await ApiClient.post("/pos/create-order-and-invoice", {
      cart, deliveryType, customerType, customerId, tableId,
      netTotal, taxTotal, total, discount, selectedQrOrderItem, selectedPaymentType
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createOrderForStripePayment(cart, deliveryType, customerType, customerId, tableId, netTotal, taxTotal, total, discount, selectedQrOrderItem) {
  try {
    console.log("POS Controller: Creating order for Stripe payment with data:", {
      cart: Array.isArray(cart) ? `${cart.length} items` : cart,
      deliveryType,
      customerType,
      customerId,
      tableId,
      netTotal,
      taxTotal,
      total,
      discount,
      selectedQrOrderItem
    });
    
    const response = await ApiClient.post("/pos/create-order-for-stripe", {
      cart, deliveryType, customerType, customerId, tableId,
      netTotal, taxTotal, total, discount, selectedQrOrderItem
    });
    
    console.log("POS Controller: Order creation response:", response);
    return response;
  } catch (error) {
    console.error("POS Controller: Order creation error:", error);
    if (error.response) {
      console.error("POS Controller: API response data:", error.response.data);
      console.error("POS Controller: API response status:", error.response.status);
    }
    throw error;
  }
}

// drafts
/**
 * @returns {Array}
 *  */ 
export function getDrafts() {
  const draftsString = localStorage.getItem(DRAFTS_KEY);
  const drafts = draftsString ? JSON.parse(draftsString) : [];
  return drafts;
}

/**
 * @param {Array} drafts 
 *  */ 
export function setDrafts(drafts) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}
// drafts

// qr orders 
export async function getQROrdersCount() {
  try {
    const response = await ApiClient.get("/pos/qrorders/count");
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getQROrders() {
  try {
    const response = await ApiClient.get("/pos/qrorders");
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cancelAllQROrders() {
  try {
    const response = await ApiClient.post("/pos/qrorders/cancel-all");
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cancelQROrder(orderId) {
  try {
    const response = await ApiClient.post(`/pos/qrorders/update-status/${orderId}`, {
      status: "cancelled"
    });
    return response;
  } catch (error) {
    throw error;
  }
}
// qr orders 