import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DIRECTIONS } from "../src/config/directions.js";
import { LIMITS } from "../src/config/constants.js";
import { validateRequest } from "../src/core/validation.js";
import { generateBadgeDesign } from "../src/services/image-generator.js";
import { moderateRequest } from "../src/services/moderation.js";
import { isAllowedOrigin, setCors } from "../src/utils/http.js";
import type { GenerateBadgeRequest } from "../src/types/badge.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
): Promise<void> {
  setCors(request, response);

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({
      error: "Alleen POST-aanvragen zijn toegestaan.",
    });
    return;
  }

  if (!isAllowedOrigin(request)) {
    response.status(403).json({
      error: "Deze website mag de AI-server niet gebruiken.",
    });
    return;
  }

  const requestSize = Number(request.headers["content-length"] || 0);

  if (requestSize > LIMITS.maxRequestBytes) {
    response.status(413).json({
      error: "De totale aanvraag is te groot.",
    });
    return;
  }

  try {
    const body = (request.body || {}) as GenerateBadgeRequest;
    const { customer, inspirationFiles } = validateRequest(body);

    await moderateRequest(customer, inspirationFiles);

    const designs = await Promise.all(
      DIRECTIONS.slice(0, LIMITS.maxDesigns).map((direction) =>
        generateBadgeDesign(customer, inspirationFiles, direction)
      )
    );

    response.status(200).json({
      designs,
      version: "3.0.0",
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("KRU1KEN Badge AI V3 fout:", error);

    response.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "De badgeontwerpen konden niet worden gemaakt.",
    });
  }
}
