import { supabase } from "@/lib/supabase";

export async function handleTradingViewWebhook(req: Request) {
  try {
    console.log("Webhook received:", {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      url: req.url,
    });

    const data = await req.json();
    console.log("Received webhook data:", data);

    // Log Supabase connection status
    const { data: healthCheck, error: healthError } = await supabase
      .from("alerts")
      .select("count(*)");

    console.log("Supabase health check:", {
      data: healthCheck,
      error: healthError,
    });

    // Save to Supabase
    const { data: savedAlert, error } = await supabase
      .from("alerts")
      .insert([
        {
          symbol: data.symbol,
          action: data.action,
          "Price at time of alert": data["Price at time of alert"],
          sl: data.sl,
          tp1: data.tp1,
          tp2: data.tp2,
          "Asset Type": data["Asset Type"],
          "Chart link": data["Chart link"],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving alert to Supabase:", error);
      throw error;
    }

    console.log("Successfully saved alert:", savedAlert);
    return new Response(JSON.stringify(savedAlert), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error in handleTradingViewWebhook:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  }
}
