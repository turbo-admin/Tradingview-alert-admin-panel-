import { supabase } from "@/lib/supabase";

export async function handleTradingViewWebhook(req: Request) {
  try {
    const data = await req.json();
    console.log("Received webhook data:", data);

    // Save to Supabase
    const { data: savedAlert, error } = await supabase
      .from("alerts")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error saving alert to Supabase:", error);
      throw error;
    }

    console.log("Successfully saved alert:", savedAlert);
    return new Response(JSON.stringify(savedAlert), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in handleTradingViewWebhook:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
