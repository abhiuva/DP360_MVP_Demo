// src/components/BarcodeScanner.jsx
import React, { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

export default function BarcodeScanner({ onDetect }) {
  const ref = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              target: ref.current,
              constraints: { facingMode: "environment" },
            },
            decoder: {
              readers: ["ean_reader", "ean_8_reader", "upc_reader", "code_128_reader"],
            },
            locate: true,
          },
          (err) => {
            if (err) { console.error(err); return; }
            if (mounted) Quagga.start();
          }
        );

        Quagga.onDetected((res) => {
          const code = res?.codeResult?.code;
          if (code) {
            Quagga.stop();
            if (mounted && onDetect) onDetect(code);
          }
        });
      } catch (e) {
        console.error("Scanner init failed:", e);
      }
    }

    init();
    return () => {
      mounted = false;
      try { Quagga.stop(); } catch {}
      Quagga.offDetected?.();
    };
  }, [onDetect]);

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden border">
      <div ref={ref} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
