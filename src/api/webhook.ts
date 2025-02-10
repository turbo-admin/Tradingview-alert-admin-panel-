import { useAlertStore } from "@/lib/alerts";
import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "@/types/supabase";

function parseAlertMessage(message: string) {
  // Extract symbol from first line
  const symbolMatch = message.match(/Your ([A-Z]+\.?P?) alert was triggered/);
  const symbol = symbolMatch ? symbolMatch[1].replace(".P", "") : "";

  // Extract action and values from second line
  const actionMatch = message.match(/(SELL|BUY) signal triggered/);
  const action = actionMatch ? actionMatch[1].toLowerCase() : "";

  // Extract SL and TP values
  const slMatch = message.match(/SL = ([0-9.]+)/);
  const tp1Match = message.match(/TP1 = ([0-9.]+)/);
  const tp2Match = message.match(/TP2 = ([0-9.]+)/);

  const sl = slMatch ? parseFloat(slMatch[1]) : null;
  const tp1 = tp1Match ? parseFloat(tp1Match[1]) : null;
  const tp2 = tp2Match ? parseFloat(tp2Match[1]) : null;

  // Extract current price from SL since it's usually close to current price
  const price = sl || 0;

  return {
    symbol,
    action: action === "buy" ? "Buy" : "Sell",
    price,
    sl,
    tp1,
    tp2,
    metrics: {
      rsi: 0,
      macd: 0,
    },
  };
}

export async function handleTradingViewWebhook(data: any) {
  try {
    console.log("Received webhook data:", data);

    let alertData: TablesInsert<"alerts">;

    // If data is a string (email format), parse it
    if (typeof data === "string") {
      console.log("Parsing string data");
      const parsed = parseAlertMessage(data);
      alertData = {
        symbol: parsed.symbol,
        action: parsed.action,
        price: parsed.price,
        sl: parsed.sl,
        tp1: parsed.tp1,
        tp2: parsed.tp2,
        metrics: parsed.metrics,
      };
    } else {
      // If data is an object (original format)
      console.log("Parsing object data");
      const { symbol, action, price, rsi, macd } = data;
      alertData = {
        symbol,
        action: action as "Buy" | "Sell",
        price: parseFloat(price),
        metrics: {
          rsi: parseFloat(rsi || 0),
          macd: parseFloat(macd || 0),
        },
      };
    }

    console.log("Prepared alert data:", alertData);

    // Save to Supabase
    const { data: savedAlert, error } = await supabase
      .from("alerts")
      .insert([alertData])
      .select()
      .single();

    if (error) {
      console.error("Error saving alert to Supabase:", error);
      throw error;
    }

    console.log("Successfully saved alert:", savedAlert);

    // Update local store with the saved alert data
    useAlertStore.getState().addAlert({
      ...alertData,
      id: savedAlert.id,
      timestamp: savedAlert.timestamp || new Date().toISOString(),
      status: savedAlert.status,
    });

    return savedAlert;
  } catch (error) {
    console.error("Error in handleTradingViewWebhook:", error);
    throw error;
  }
}
