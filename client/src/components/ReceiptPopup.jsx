import React from 'react';
import './ReceiptPopup.css';

const ReceiptPopup = ({ receipt, onClose }) => {
  return (
    <div className="receipt-popup">
      <div className="receipt-popup-box">
        <h2>Pickup Receipt</h2>
        <p><strong>Order Code:</strong> #{receipt.orderCode}</p>
        <p><strong>Name:</strong> {receipt.name}</p>
        <p><strong>Email:</strong> {receipt.email}</p>
        <p><strong>Total:</strong> ${receipt.amount.toFixed(2)}</p>
        <ul>
          {receipt.items.map((item, i) => (
            <li key={i}>{item.name} × {item.quantity}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ReceiptPopup;
