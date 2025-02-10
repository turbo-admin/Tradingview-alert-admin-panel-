import { create } from "zustand";

export interface Alert {
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
  sl?: number;
  tp1?: number;
  tp2?: number;
}

interface AlertStore {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id" | "timestamp" | "status">) => void;
  updateAlertStatus: (id: string, status: Alert["status"]) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlert: (newAlert) =>
    set((state) => ({
      alerts: [
        {
          ...newAlert,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          status: "pending",
        },
        ...state.alerts,
      ],
    })),
  updateAlertStatus: (id, status) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, status } : alert,
      ),
    })),
}));
