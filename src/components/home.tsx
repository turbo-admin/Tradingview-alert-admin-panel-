import React, { useState, useEffect } from "react";
import { useAlertStore } from "@/lib/alerts";
import { ThemeToggle } from "./ui/theme-toggle";
import AlertListPanel from "./AlertListPanel";
import ChartPanel from "./ChartPanel";
import ActionPanel from "./ActionPanel";

interface Alert {
  id: string;
  symbol: string;
  action: "Buy" | "Sell";
  price: number;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
  metrics: {
    rsi: number;
    macd: number;
  };
}

const Home = () => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load alerts when component mounts
  useEffect(() => {
    useAlertStore.getState().loadAlerts();
  }, []);

  const handleAlertSelect = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const handleAccept = async (values: {
    sl: string;
    tp1: string;
    tp2: string;
  }) => {
    setIsLoading(true);
    try {
      if (selectedAlert) {
        await useAlertStore
          .getState()
          .updateAlertStatus(selectedAlert.id, "approved");
      }
    } catch (error) {
      console.error("Error accepting alert:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      if (selectedAlert) {
        await useAlertStore
          .getState()
          .updateAlertStatus(selectedAlert.id, "rejected");
      }
    } catch (error) {
      console.error("Error rejecting alert:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background flex relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <AlertListPanel
        onSelectAlert={handleAlertSelect}
        selectedAlertId={selectedAlert?.id}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <ChartPanel
            symbol={selectedAlert?.symbol}
            price={selectedAlert?.price}
            direction={selectedAlert?.action.toLowerCase() as "buy" | "sell"}
            tradingViewConfig={{
              symbol: selectedAlert?.symbol || "BTCUSDT",
              interval: "1D",
            }}
          />
        </div>
        <ActionPanel
          onAccept={handleAccept}
          onReject={handleReject}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Home;
