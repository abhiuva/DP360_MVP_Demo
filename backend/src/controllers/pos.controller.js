const {
  getCategoriesDB,
  getPaymentTypesDB,
  getPrintSettingDB,
  getStoreSettingDB,
  getStoreTablesDB,
} = require("../services/settings.service");
const {
  getAllMenuItemsDB,
  getAllAddonsDB,
  getAllVariantsDB,
} = require("../services/menu_item.service");
const { createOrderDB, getPOSQROrdersCountDB, getPOSQROrdersDB, updateQROrderStatusDB, cancelAllQROrdersDB } = require("../services/pos.service");
const { createInvoiceDB } = require("../services/orders.service");

exports.getPOSInitData = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;

    const [categories, paymentTypes, printSettings, storeSettings, storeTables] = await Promise.all([
      getCategoriesDB(tenantId),
      getPaymentTypesDB(true, tenantId),
      getPrintSettingDB(tenantId),
      getStoreSettingDB(tenantId),
      getStoreTablesDB(tenantId)
    ]);

    const [menuItems, addons, variants] = await Promise.all([
      getAllMenuItemsDB(tenantId),
      getAllAddonsDB(tenantId),
      getAllVariantsDB(tenantId),
    ]);

    const formattedMenuItems = menuItems.map((item) => {
      const itemAddons = addons.filter((addon) => addon.item_id == item.id);
      const itemVariants = variants.filter(
        (variant) => variant.item_id == item.id
      );

      return {
        ...item,
        addons: [...itemAddons],
        variants: [...itemVariants],
      };
    });

    return res.status(200).json({
      categories,
      paymentTypes,
      printSettings,
      storeSettings,
      storeTables,
      menuItems: formattedMenuItems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

exports.createOrder = async (req, res) => {

  try {
    const tenantId = req.user.tenant_id;

    const {cart, deliveryType, customerType, customerId, tableId, selectedQrOrderItem} = req.body;

    if(cart?.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty!"
      });
    }

    const result = await createOrderDB(tenantId, cart, deliveryType, customerType, customerId?.id || null, tableId || null);

    if(selectedQrOrderItem) {
      await updateQROrderStatusDB(tenantId, selectedQrOrderItem, "completed");
    }
    

    return res.status(200).json({
      success: true,
      message: `Order created. Token: ${result.tokenNo}`,
      tokenNo: result.tokenNo,
      orderId: result.orderId,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error processing the request, please try after sometime!"
    });
  }

};

exports.createOrderAndInvoice = async (req, res) => {

  try {
    const tenantId = req.user.tenant_id;

    const {cart, deliveryType, customerType, customerId, tableId, netTotal, taxTotal, total, discount, selectedQrOrderItem, selectedPaymentType} = req.body;

    if(cart?.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty!"
      });
    }

    // create invoice
    const now = new Date();
    const date = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const invoiceId = await createInvoiceDB(netTotal, taxTotal, total, discount, date, selectedPaymentType, tenantId);
    // create invoice

    const result = await createOrderDB(tenantId, cart, deliveryType, customerType, customerId?.id || null, tableId || null, 'paid', invoiceId);
    const orderId = result.orderId;
    const tokenNo = result.tokenNo;

    if(selectedQrOrderItem) {
      await updateQROrderStatusDB(tenantId, selectedQrOrderItem, "completed");
    }

    return res.status(200).json({
      success: true,
      message: `Order created. Token: ${tokenNo}`,
      tokenNo,
      orderId,
      invoiceId
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error processing the request, please try after sometime!"
    });
  }

};

exports.getPOSQROrdersCount = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;

    const totalQROrders = await getPOSQROrdersCountDB(tenantId);
    return res.status(200).json({
      status: true,
      totalQROrders: totalQROrders
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

exports.getPOSQROrders = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;

    const { kitchenOrders, kitchenOrdersItems, addons } = await getPOSQROrdersDB(tenantId);

    const formattedOrders = kitchenOrders.map((order)=>{
      const orderItems = kitchenOrdersItems.filter((oi)=>oi.order_id == order.id);
      
      orderItems.forEach((oi, index)=>{
        const addonsIds = oi?.addons ? JSON.parse(oi?.addons) : null;

        if(addonsIds) {
          const itemAddons = addonsIds.map((addonId)=>{
            const addon = addons.filter((a)=>a.id == addonId);
            return addon[0];
          });
          orderItems[index].addons = [...itemAddons];
        }
      });

      return {
        ...order,
        items: orderItems
      }
    })

    return res.status(200).json(formattedOrders)
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

exports.updatePOSQROrderStatus = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const orderId = req.params.id;
    const status = req.body.status;

    if(!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide required details!"
      });
    }

    await updateQROrderStatusDB(tenantId, orderId, status);
    return res.status(200).json({
      status: true,
      message: "QR Order item status updated."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

exports.cancelAllQROrders = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const status = 'cancelled';

    await cancelAllQROrdersDB(tenantId, status);
    return res.status(200).json({
      status: true,
      message: "All QR Order items cleared."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

// Create order for Stripe payment
exports.createOrderForStripe = async (req, res) => {
  try {
    console.log('Create order for Stripe request:', req.body);
    console.log('User context:', req.user);
    
    const { cart, deliveryType, customerType, customerId, tableId, netTotal, taxTotal, total, discount, selectedQrOrderItem } = req.body;
    
    // Check if cart exists (it might be a string like "1 items" or an array)
    if (!cart) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    // Generate a temporary order ID
    // const tempOrderId = 'temp_' + Date.now();
    
    // Get tenant ID safely
    const tenantId = req.user?.tenant_id || req.user?.tenantId || 'unknown';
    
    // For testing purposes, we'll use mock items if cart is not an array
    const items = Array.isArray(cart) ? cart : [
      {
        name: 'Order Item',
        price: netTotal || 1,
        quantity: 1
      }
    ];
    
    const result = await createOrderDB(tenantId, cart, deliveryType, customerType, customerId?.id || null, tableId || null);
    // Return order data that will be used by the Stripe checkout
    
    const response = {
      success: true,
      orderId: result.orderId,
      orderData: {
        items,
        total: total || netTotal || 1,
        customerType,
        customerId,
        tableId,
        deliveryType,
        discount,
        tenantId: tenantId
      }
    };
    
    console.log('Create order for Stripe response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error creating order for Stripe:', error);
    res.status(500).json({ 
      message: 'Error creating order', 
      error: error.message,
      success: false
    });
  }
};