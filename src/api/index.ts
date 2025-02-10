import { handleTradingViewWebhook } from "./webhook";

export async function handleRequest(request: Request) {
  const url = new URL(request.url);
  console.log("API Request:", {
    method: request.method,
    path: url.pathname,
    headers: Object.fromEntries(request.headers.entries()),
  });

  // Handle webhook endpoint
  if (url.pathname === "/api/webhook") {
    // Handle OPTIONS request for CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Handle POST request
    if (request.method === "POST") {
      return handleTradingViewWebhook(request);
    }
  }

  return new Response("Not Found", { status: 404 });
}
