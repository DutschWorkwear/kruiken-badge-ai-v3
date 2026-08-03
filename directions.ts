import { getOpenAIClient } from "./openai-client.js";
import type { CustomerInput, InspirationFile } from "../types/badge.js";

export async function moderateRequest(
  customer: CustomerInput,
  inspirationFiles: InspirationFile[]
): Promise<void> {
  const text = [
    customer.group,
    customer.place,
    customer.year,
    customer.slogan,
    customer.description,
  ]
    .filter(Boolean)
    .join("\n");

  const input = [
    {
      type: "text" as const,
      text,
    },
    ...inspirationFiles.map((file) => ({
      type: "image_url" as const,
      image_url: {
        url: file.dataUrl,
      },
    })),
  ];

  const result = await getOpenAIClient().moderations.create({
    model: "omni-moderation-latest",
    input,
  });

  if (result.results?.some((item) => item.flagged)) {
    throw new Error(
      "De omschrijving of een inspiratiebestand kan niet worden verwerkt."
    );
  }
}
