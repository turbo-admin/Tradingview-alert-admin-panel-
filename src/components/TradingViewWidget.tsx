import React, { useEffect, useRef } from "react";

interface SymbolInfo {
  price: number;
  change: number;
}

interface TradingViewWidgetProps {
  symbol: string;
  theme?: "light" | "dark";
  interval?: string;
  onSymbolData?: (data: SymbolInfo) => void;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export function TradingViewWidget({
  symbol = "BTCUSDT",
  theme = "light",
  interval = "1D",
  onSymbolData,
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Setup WebSocket for real-time price updates
    wsRef.current = new WebSocket("wss://stream.binance.com:9443/ws");

    wsRef.current.onopen = () => {
      if (wsRef.current) {
        wsRef.current.send(
          JSON.stringify({
            method: "SUBSCRIBE",
            params: [`${symbol.toLowerCase()}@ticker`],
            id: 1,
          }),
        );
      }
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.e === "24hrTicker") {
        const price = parseFloat(data.c);
        const change = parseFloat(data.P);
        onSymbolData?.({ price, change });
      }
    };

    // Setup TradingView widget
    if (container.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            width: "100%",
            height: "100%",
            symbol: `BINANCE:${symbol}`,
            interval,
            timezone: "Etc/UTC",
            theme,
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: container.current?.id,
            autosize: true,
            studies: [
              "MASimple@tv-basicstudies",
              "RSI@tv-basicstudies",
              "MACD@tv-basicstudies",
            ],
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        wsRef.current?.close();
      };
    }
  }, [symbol, theme, interval]);

  return (
    <div
      id={`tradingview_${symbol}`}
      ref={container}
      className="w-full h-full"
    />
  );
}
