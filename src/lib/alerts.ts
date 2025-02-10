import { create } from "zustand";
import { supabase } from "./supabase";

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
  loadAlerts: () => Promise<void>;
  addAlert: (alert: Omit<Alert, "id" | "timestamp" | "status">) => void;
  updateAlertStatus: (id: string, status: Alert["status"]) => Promise<void>;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  loadAlerts: async () => {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error loading alerts:", error);
      return;
    }

    set({ alerts: data || [] });
  },
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
  updateAlertStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        alerts: state.alerts.map((alert) =>
          alert.id === id ? { ...alert, status } : alert,
        ),
      }));
    } catch (error) {
      console.error("Error updating alert status:", error);
      throw error;
    }
  },
}));

// Load alerts when the store is initialized
useAlertStore.getState().loadAlerts();
