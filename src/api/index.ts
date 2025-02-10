import { handleTradingViewWebhook } from "./webhook";

export async function handleRequest(request: Request) {
  const url = new URL(request.url);

  // Handle webhook endpoint
  if (url.pathname === "/api/webhook" && request.method === "POST") {
    return handleTradingViewWebhook(request);
  }

  return new Response("Not Found", { status: 404 });
}
