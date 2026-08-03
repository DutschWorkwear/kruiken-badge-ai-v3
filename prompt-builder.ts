import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DEFAULTS } from "../config/constants.js";

export function setCors(
  request: VercelRequest,
  response: VercelResponse
): void {
  const allowedOrigin =
    process.env.ALLOWED_ORIGIN || DEFAULTS.allowedOrigin;
  const origin = request.headers.origin;

  if (origin === allowedOrigin) {
    response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export function isAllowedOrigin(request: VercelRequest): boolean {
  const allowedOrigin =
    process.env.ALLOWED_ORIGIN || DEFAULTS.allowedOrigin;

  return request.headers.origin === allowedOrigin;
}
