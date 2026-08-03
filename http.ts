import { randomUUID } from "node:crypto";
import { DEFAULTS } from "../config/constants.js";
import { buildBadgePrompt } from "../core/prompt-builder.js";
import { getOpenAIClient } from "./openai-client.js";
import type {
  BadgeDesign,
  BadgeDirection,
  CustomerInput,
  InspirationFile,
} from "../types/badge.js";

function getQuality(): "low" | "medium" | "high" | "auto" {
  const value = process.env.IMAGE_QUALITY || DEFAULTS.imageQuality;

  if (value === "low" || value === "high" || value === "auto") {
    return value;
  }

  return "medium";
}

export async function generateBadgeDesign(
  customer: CustomerInput,
  inspirationFiles: InspirationFile[],
  direction: BadgeDirection
): Promise<BadgeDesign> {
  const content = [
    {
      type: "input_text" as const,
      text: buildBadgePrompt(customer, direction),
    },
    ...inspirationFiles.map((file) => ({
      type: "input_image" as const,
      image_url: file.dataUrl,
      detail: "high" as const,
    })),
  ];

  const result = await getOpenAIClient().responses.create({
    model: process.env.OPENAI_MODEL || DEFAULTS.textModel,
    store: false,
    input: [
      {
        role: "user",
        content,
      },
    ],
    tools: [
      {
        type: "image_generation",
        model: process.env.OPENAI_IMAGE_MODEL || DEFAULTS.imageModel,
        action: "auto",
        background: "transparent",
        input_fidelity: inspirationFiles.length ? "high" : "low",
        output_format: "png",
        quality: getQuality(),
        size: "1024x1024",
        moderation: "auto",
      },
    ],
    tool_choice: "required",
  });

  const imageCall = result.output?.find(
    (item) =>
      item.type === "image_generation_call" &&
      typeof item.result === "string"
  );

  if (!imageCall?.result) {
    throw new Error(`Ontwerp '${direction.name}' kon niet worden gemaakt.`);
  }

  return {
    id: randomUUID(),
    name: direction.name,
    direction: direction.id,
    dataUrl: `data:image/png;base64,${imageCall.result}`,
  };
}
