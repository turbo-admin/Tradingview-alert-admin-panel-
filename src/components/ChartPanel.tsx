import React, { useState } from "react";
import { TradingViewWidget } from "./TradingViewWidget";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowUpCircle, ArrowDownCircle, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";

interface ChartPanelProps {
  symbol?: string;
  price?: number;
  change?: number;
  direction?: "buy" | "sell";
  tradingViewConfig?: {
    symbol: string;
    interval: string;
  };
}

const ChartPanel = ({
  symbol = "BTCUSDT",
  price = 50000,
  change = 2.5,
  direction = "buy",
  tradingViewConfig = {
    symbol: "BTCUSDT",
    interval: "1D",
  },
}: ChartPanelProps) => {
  const [currentPrice, setCurrentPrice] = useState(price);
  const [currentChange, setCurrentChange] = useState(change);

  const handleSymbolData = (data: { price: number; change: number }) => {
    setCurrentPrice(data.price);
    setCurrentChange(data.change);
  };

  return (
    <Card className="w-full h-full bg-background border rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">{symbol}</h2>
          <Badge variant={direction === "buy" ? "default" : "destructive"}>
            {direction === "buy" ? (
              <ArrowUpCircle className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownCircle className="w-4 h-4 mr-1" />
            )}
            {direction.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xl font-semibold">
              ${currentPrice.toLocaleString()}
            </div>
            <div
              className={`text-sm ${currentChange >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {currentChange >= 0 ? "+" : ""}
              {currentChange.toFixed(2)}%
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full bg-background">
        <TradingViewWidget
          symbol={tradingViewConfig.symbol}
          interval={tradingViewConfig.interval}
          theme={
            document.documentElement.classList.contains("dark")
              ? "dark"
              : "light"
          }
          onSymbolData={handleSymbolData}
        />
      </div>

      <div className="p-4 border-t">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="font-medium">$1.2B</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">24h High</div>
            <div className="font-medium">$51,234</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">24h Low</div>
            <div className="font-medium">$48,765</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Market Cap</div>
            <div className="font-medium">$950.5B</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChartPanel;
