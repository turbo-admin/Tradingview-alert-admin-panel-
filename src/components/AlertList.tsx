import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Alert {
  id: string;
  created_at: string;
  symbol: string;
  action: string;
  "Price at time of alert": number;
  sl: number;
  tp1: number;
  tp2: number;
  "Asset Type": string;
  "Chart link": string;
}

export default function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchAlerts();

    // Subscribe to new alerts
    const channel = supabase
      .channel("alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => {
          setAlerts((current) => [payload.new as Alert, ...current]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchAlerts() {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching alerts:", error);
      return;
    }

    setAlerts(data);
  }

  return (
    <div className="w-[400px] h-screen bg-background border-r overflow-auto p-4">
      <h2 className="text-xl font-bold mb-4">Trading Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{alert.symbol}</span>
              <span
                className={`px-2 py-1 rounded text-sm ${alert.action === "Buy" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
              >
                {alert.action}
              </span>
            </div>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>Price: ${alert["Price at time of alert"].toLocaleString()}</p>
              <p>SL: ${alert.sl.toLocaleString()}</p>
              <p>TP1: ${alert.tp1.toLocaleString()}</p>
              <p>TP2: ${alert.tp2.toLocaleString()}</p>
              <a
                href={alert["Chart link"]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Chart
              </a>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {new Date(alert.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
