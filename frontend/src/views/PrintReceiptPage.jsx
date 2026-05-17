import React from 'react'
import { getDetailsForReceiptPrint } from '../helpers/ReceiptHelper'

export default function PrintReceiptPage() {
  const receiptDetails = getDetailsForReceiptPrint();

  const {
    cartItems,
    deliveryType,
    customerType,
    customer,
    tableId,
    currency,
    storeSettings,
    printSettings,
    itemsTotal,
    taxTotal,
    payableTotal,
    tokenNo,
    orderId,
    date,
    paymentMethod,
    invoiceNumber,
  } = receiptDetails;

  const {
    store_name,
    address,
    phone,
    email,
    image: storeImage,
  } = storeSettings;

  const {
    page_format,
    header,
    footer,
    show_notes,
    show_store_details,
    show_customer_details,
    print_token,
  } = printSettings;

  return (
    <div className={`w-[${page_format}mm] font-sans px-4 text-sm`}>
      
      {/* Store Details */}
      {show_store_details == 1 && (
        <>
          {storeImage && <img src={storeImage} className='w-16 h-16 mx-auto' />}
          <div className="text-center mt-2 font-semibold">
            <p>{store_name}</p>
            <p>{address}</p>
            <p>Phone: {phone}</p>
            <p>Email: {email}</p>
          </div>
          <div className="border-b border-dashed my-2"></div>
        </>
      )}

      {/* Header */}
      {header && (
        <div className="text-center my-2 font-medium">
          <p>{header}</p>
          <div className="border-b border-dashed my-2"></div>
        </div>
      )}

      {/* Customer Info */}
      {show_customer_details == 1 && (
        <div className="mb-2">
          <p><strong>Customer:</strong> {customer?.name || customer?.email || "Guest"}</p>
          <p><strong>Type:</strong> {customerType}</p>
          <p><strong>Order Type:</strong> {deliveryType}</p>
        </div>
      )}

      {/* Payment & Metadata */}
      <div className="mb-2">
        {paymentMethod && <p><strong>Payment:</strong> {paymentMethod}</p>}
        <p><strong>Invoice #:</strong> {invoiceNumber || orderId}</p>
        <p><strong>Token No:</strong> {tokenNo}</p>
        <p><strong>Date:</strong> {new Date(date).toLocaleString()}</p>
      </div>

      <div className="border-b border-dashed my-2"></div>

      {/* Items Table */}
      <div className="mb-3">
        {cartItems.map((item, idx) => {
          const {
            title,
            quantity,
            notes,
            price,
            discount,
            addons,
            addons_ids,
            variant,
          } = item;

          const finalUnitPrice = Number(price) - Number(discount || 0);
          const totalPrice = quantity * finalUnitPrice;

          return (
            <div key={idx} className="mb-2">
              <div className="font-medium">{title}{variant && ` - ${variant.title}`}</div>
              {addons_ids?.length > 0 && (
                <p className='text-xs'>Addons: {addons_ids.map(aid => {
                  const addon = addons.find(a => a.id == aid);
                  return addon?.title;
                }).filter(Boolean).join(", ")}</p>
              )}
              {show_notes == 1 && notes && <p className='text-xs italic'>Notes: {notes}</p>}
              <div className="flex justify-between">
                <p>{quantity} x {currency}{finalUnitPrice.toFixed(2)} {discount > 0 && <span className='text-xs text-red-600'>(-{currency}{discount})</span>}</p>
                <p>{currency}{totalPrice.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-b border-dashed my-2"></div>

      {/* Totals */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Subtotal (excl. tax):</span>
          <span>{currency}{itemsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>{currency}{taxTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-dashed pt-1">
          <span>Total:</span>
          <span>{currency}{payableTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="text-center my-3 text-xs italic">
          <div className="border-t border-dashed mt-3 pt-2"></div>
          {footer}
        </div>
      )}

      {/* Token Display (if enabled) */}
      {print_token == 1 && tokenNo && (
        <div className='border-t border-dashed mt-6 py-10 text-center'>
          <div className="text-md font-semibold">Token No.</div>
          <div className="w-28 h-28 mx-auto border-black border-2 text-black flex items-center justify-center font-bold text-4xl rounded-full">
            {tokenNo}
          </div>
        </div>
      )}
    </div>
  )
}
