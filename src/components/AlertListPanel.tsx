import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Check, X, Clock } from "lucide-react";

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

interface AlertListPanelProps {
  alerts?: Alert[];
  onSelectAlert?: (alert: Alert) => void;
  selectedAlertId?: string;
}

const defaultAlerts: Alert[] = [
  {
    id: "1",
    symbol: "BTC/USD",
    action: "Buy",
    price: 45000,
    timestamp: new Date().toISOString(),
    status: "pending",
    metrics: {
      rsi: 65,
      macd: 0.5,
    },
  },
  {
    id: "2",
    symbol: "ETH/USD",
    action: "Sell",
    price: 2800,
    timestamp: new Date().toISOString(),
    status: "approved",
    metrics: {
      rsi: 75,
      macd: -0.3,
    },
  },
  {
    id: "3",
    symbol: "SOL/USD",
    action: "Buy",
    price: 120,
    timestamp: new Date().toISOString(),
    status: "rejected",
    metrics: {
      rsi: 30,
      macd: 0.2,
    },
  },
];

import { useAlertStore } from "@/lib/alerts";

const AlertListPanel = ({
  alerts = useAlertStore((state) => state.alerts),
  onSelectAlert = () => {},
  selectedAlertId = "",
}: AlertListPanelProps) => {
  const getStatusIcon = (status: Alert["status"]) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Alert["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  return (
    <div className="h-full w-[400px] bg-background border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Trade Alerts</h2>
      </div>
      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="p-4 space-y-4">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-4 cursor-pointer hover:bg-accent transition-colors ${selectedAlertId === alert.id ? "border-primary" : ""}`}
              onClick={() => onSelectAlert(alert)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{alert.symbol}</span>
                    <Badge
                      variant="secondary"
                      className={
                        alert.action === "Buy"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }
                    >
                      {alert.action}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    ${alert.price.toLocaleString()}
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(alert.status)}
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(alert.status)}
                          <span className="capitalize">{alert.status}</span>
                        </div>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>RSI: {alert.metrics.rsi}</p>
                      <p>MACD: {alert.metrics.macd}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {new Date(alert.timestamp).toLocaleString()}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlertListPanel;
