import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  _request: VercelRequest,
  response: VercelResponse
): void {
  response.status(200).json({
    ok: true,
    version: "3.0.0",
    service: "KRU1KEN Badge AI V3",
    message: "De modulaire AI-server draait.",
  });
}
