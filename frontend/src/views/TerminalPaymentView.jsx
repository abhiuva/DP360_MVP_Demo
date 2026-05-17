import React, { useEffect, useState } from "react";

const TerminalPaymentView = () => {
  const [terminal, setTerminal] = useState(null);
  const [reader, setReader] = useState(null);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const tenantId = localStorage.getItem("tenant_id") || "18";

  useEffect(() => {
    const loadStripeTerminal = async () => {
      try {
        const stripeScript = await import("https://js.stripe.com/terminal/v1/");
        const terminalInstance = stripeScript.StripeTerminal.create({
          onFetchConnectionToken: async () => {
            const res = await fetch("/api/v1/terminal/connection-token", {
              method: "POST",
            });
            const data = await res.json();
            return data.secret;
          },
        });
        setTerminal(terminalInstance);
      } catch (err) {
        console.error("Failed to load Stripe Terminal:", err);
        setMessage("Stripe Terminal SDK failed to load.");
      }
    };

    loadStripeTerminal();
  }, []);

  const connectReader = async () => {
    if (!terminal) {
      setMessage("Terminal not ready.");
      return;
    }

    setMessage("Looking for readers...");
    const result = await terminal.discoverReaders({ simulated: true });

    if (result.error) {
      setMessage(`Discovery failed: ${result.error.message}`);
      return;
    }

    if (result.discoveredReaders.length === 0) {
      setMessage("No readers found.");
      return;
    }

    const selectedReader = result.discoveredReaders[0];
    const connectResult = await terminal.connectReader(selectedReader);

    if (connectResult.error) {
      setMessage(`Failed to connect: ${connectResult.error.message}`);
    } else {
      setReader(connectResult.reader);
      setMessage(`Connected to: ${connectResult.reader.label}`);
    }
  };

  const handlePayment = async () => {
    if (!amount || isNaN(amount)) {
      setMessage("Enter a valid amount");
      return;
    }

    const paymentIntentRes = await fetch("/api/v1/terminal/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(parseFloat(amount) * 100),
        currency: "usd",
        tenant_id: tenantId,
      }),
    });

    const paymentIntent = await paymentIntentRes.json();
    const collectResult = await terminal.collectPaymentMethod(paymentIntent);

    if (collectResult.error) {
      setMessage(`Payment method error: ${collectResult.error.message}`);
      return;
    }

    const confirmResult = await terminal.processPayment(collectResult.paymentIntent);

    if (confirmResult.error) {
      setMessage(`Payment failed: ${confirmResult.error.message}`);
    } else {
      setMessage("Payment successful!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Stripe Terminal Payment</h2>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Amount (USD)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-3 py-2 w-full"
          placeholder="Enter amount"
        />
      </div>
      <div className="flex gap-3 mb-4">
        <button
          onClick={connectReader}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Connect Reader
        </button>
        <button
          onClick={handlePayment}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Charge
        </button>
      </div>
      <p className="text-sm text-gray-700">{message}</p>
    </div>
  );
};

export default TerminalPaymentView;
