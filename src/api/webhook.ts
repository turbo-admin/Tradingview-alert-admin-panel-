import { useAlertStore } from "@/lib/alerts";

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
  // If data is a string (email format), parse it
  if (typeof data === "string") {
    const parsedData = parseAlertMessage(data);
    useAlertStore.getState().addAlert(parsedData);
    return;
  }

  // If data is an object (original format)
  const { symbol, action, price, rsi, macd } = data;

  useAlertStore.getState().addAlert({
    symbol,
    action: action as "Buy" | "Sell",
    price: parseFloat(price),
    metrics: {
      rsi: parseFloat(rsi || 0),
      macd: parseFloat(macd || 0),
    },
  });
}
