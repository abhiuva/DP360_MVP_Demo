const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { CONFIG } = require('../config');
const  {getOrdersPaymentSummaryDB, updateOrderStatusDB} = require("../services/orders.service");
const { createInvoiceDB } = require("../services/orders.service");

// Create a Stripe checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { amount, orderId, currency, customerEmail, successUrl, cancelUrl, orderData } = req.body;
    
    console.log('Request body:', req.body);
    console.log('User context:', req.user);
    
    // Support different formats
    if ((!amount && !orderData?.total) || (!orderId && !orderData?.orderId)) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    // Create line items for Stripe
    let lineItems;
    let metadata = {};
    let total;
    
    // Get tenant ID safely
    const tenantId = req.user?.tenant_id || req.user?.tenantId || 'unknown';
    
    // If using direct amount format
    if (amount) {
      lineItems = [{
        price_data: {
          currency: currency || 'usd',
          product_data: {
            name: 'Order #' + orderId,
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      }];
      
      metadata = {
        orderId: orderId,
        tenantId: tenantId,
        customerEmail
      };
      total = amount;
    } 
    // If using order data format
    else if (orderData) {
      // Handle both array of items and single item
      const items = orderData.items || [{
        name: 'Order #' + (orderData.orderId || 'unknown'),
        price: orderData.total || 1,
        quantity: 1
      }];
      
      lineItems = items.map(item => ({
        price_data: {
          currency: currency || 'usd',
          product_data: {
            name: item.name || 'Product',
            description: item.description || '',
          },
          unit_amount: Math.round((item.price || 1) * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      }));
      
      metadata = {
        orderId: orderData.orderId || orderId,
        tenantId: tenantId,
      };
      total = orderData.total;
    }

    console.log('Creating Stripe session with:', { lineItems, metadata, total });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
      customer_email: customerEmail,
    });

    console.log('Session created successfully:', session.id);

    res.status(200).json({ 
      sessionId: session.id, 
      url: session.url,
      success: true 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      message: 'Error creating payment session', 
      error: error.message,
      success: false 
    });
  }
};

// Verify a payment using the session ID
exports.verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Payment session not found' });
    }

    res.status(200).json({
      status: session.payment_status,
      orderId: session.metadata.orderId,
      paymentIntent: session.payment_intent,
      customer: session.customer,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

// Complete the order after payment
exports.completeOrder = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { orderId, paymentIntentId, paymentMethod } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    let orderIds = []
    orderIds.push(orderId)

    const orderIdsParams = orderIds.join(",");
    
    const {kitchenOrders,kitchenOrdersItems,addons} = await getOrdersPaymentSummaryDB(orderIdsParams, tenantId);

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
    
    
    const now = new Date();
    const date = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // calculate summary
    let subtotal = 0;
    let taxTotal = 0;
    let total = 0;
    let discount_total = 0;

    for (const order of formattedOrders) {
      const items = order.items;
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const { variant_price, price, tax_rate, tax_type: taxType, quantity, addons, discount } = item;
        const taxRate = Number(tax_rate);
        let addonsTotal = 0;
        if(addons) {
          for (const addon of addons) {
            addonsTotal += Number(addon.price)
          }
        }

        const itemPrice = ((Number(variant_price?variant_price:price) + addonsTotal) * Number(quantity));

        if (taxType == "exclusive") {
          const tax = (itemPrice * taxRate) / 100;
          const priceWithTax = itemPrice + tax;
          const discount_price = (itemPrice * discount) / 100;

          taxTotal += tax;
          subtotal += itemPrice;
          total += priceWithTax - discount_price;
          discount_total += discount_price;

        } else if (taxType == "inclusive") {
          const tax = itemPrice - (itemPrice * (100 / (100 + taxRate)));
          const priceWithoutTax = itemPrice - tax;
          const discount_price = (priceWithoutTax * discount) / 100;

          taxTotal += tax;
          subtotal += priceWithoutTax;
          total += itemPrice - discount_price;
          discount_total += discount_price;

        } else {
          const discount_price = (itemPrice * discount) / 100;
          subtotal += itemPrice;
          total += itemPrice;
          discount_total += discount_price;
        }
      }
    }

    const invoiceId = await createInvoiceDB(subtotal, taxTotal, total, discount_total, date, paymentMethod, tenantId);   
    await updateOrderStatusDB(orderId, "paid",invoiceId, tenantId)

    // Here you would typically:
    // 1. Update the order status to 'paid'
    // 2. Create an invoice if needed
    // 3. Update inventory
    // 4. Notify kitchen/staff via Socket.IO
    

    // This part will need to be integrated with your existing order processing logic
    
    res.status(200).json({ 
      success: true, 
      message: 'Order completed successfully',
      orderId
    });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ message: 'Error completing order', error: error.message });
  }
}; 

exports.CreateConnectionToken = async(req, res) => {
  try{
      const connectionToken = await stripe.terminal.connectionTokens.create();
      res.status(200).json({ secret: connectionToken.secret });
  }catch(Error){
    console.error('Error completing connection:', error);
    res.status(500).json({ message: 'Error completing connection', error: error.message });
  }
}

exports.CreatePaymentIntent = async(req, res) => {
  try{
      const {amount, currency} = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
      });
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
  }catch(Error){
    console.error('Error creating paymentintent:', error);
    res.status(500).json({ message: 'Error creating paymentintent', error: error.message });
  }
}