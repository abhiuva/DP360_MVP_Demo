import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StripeReaderConnect() {
  const [reader, setReader] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const fetchConnectionToken = async () => {
    try {
      const res = await axios.post("/terminal/connection_token");
      return res.data.secret;
    } catch (err) {
      toast({
        title: "Failed to get connection token",
        description: err.message,
      });
      return null;
    }
  };

  const discoverAndConnect = async () => {
    setConnecting(true);
    const token = await fetchConnectionToken();
    if (!token) return setConnecting(false);

    const terminal = StripeTerminal.create({
      onFetchConnectionToken: async () => token,
    });

    const discoveryResult = await terminal.discoverReaders({ method: "usb" });
    if (discoveryResult.error) {
      toast({
        title: "Discovery error",
        description: discoveryResult.error.message,
      });
      setConnecting(false);
      return;
    }

    if (discoveryResult.discoveredReaders.length === 0) {
      toast({ title: "No readers found" });
      setConnecting(false);
      return;
    }

    const selectedReader = discoveryResult.discoveredReaders[0];
    const connectResult = await terminal.connectReader(selectedReader);

    if (connectResult.error) {
      toast({
        title: "Connection error",
        description: connectResult.error.message,
      });
    } else {
      setReader(connectResult.reader);
      window.connectedStripeReader = connectResult.reader;

      toast({
        title: "Connected",
        description: `Connected to ${connectResult.reader.label}`,
      });
    }
    setConnecting(false);
  };

  return (
    <div className="p-4 border rounded-xl mt-4">
      <h2 className="text-lg font-semibold mb-2">Stripe Reader Connection</h2>
      {reader ? (
        <p className="text-green-600">Connected to: {reader.label}</p>
      ) : (
        <Button onClick={discoverAndConnect} disabled={connecting}>
          {connecting ? "Connecting..." : "Connect to Stripe Reader"}
        </Button>
      )}
    </div>
  );
}
