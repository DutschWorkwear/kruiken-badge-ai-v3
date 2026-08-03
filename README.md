# KRU1KEN Badge AI V3

Modulaire TypeScript-backend voor de Shopify Badge Studio.

## Wat zit erin?

- drie parallelle badgeontwerpen;
- vaste productie- en borduurregels;
- maximaal vier inspiratieafbeeldingen;
- moderatie van tekst en afbeeldingen;
- transparante PNG-output;
- TypeScript en duidelijke modules;
- dezelfde response-structuur als de huidige Shopify Liquid.

## Upload naar GitHub

1. Pak het ZIP-bestand uit.
2. Maak een nieuwe lege repository, bijvoorbeeld:
   `kruiken-badge-ai-v3`
3. Sleep alle inhoud van de uitgepakte map naar GitHub.
4. Commit rechtstreeks naar `main`.
5. Importeer de repository als nieuw project in Vercel.

## Vercel Environment Variables

Gebruik dezelfde instellingen als bij V2:

```text
OPENAI_API_KEY=<jouw geheime sleutel>
ALLOWED_ORIGIN=https://kruikenstadshop.nl
OPENAI_MODEL=gpt-5
OPENAI_IMAGE_MODEL=gpt-image-1
IMAGE_QUALITY=medium
```

## Test

Open na deployment:

```text
https://jouw-v3-domein.vercel.app/api/health
```

Verwachte reactie:

```json
{
  "ok": true,
  "version": "3.0.0",
  "service": "KRU1KEN Badge AI V3",
  "message": "De modulaire AI-server draait."
}
```

## Shopify pas later omzetten

Laat eerst V2 gekoppeld. Test V3 apart. Pas wanneer V3 goed werkt,
vervang je in de Shopify Theme Editor het endpoint door:

```text
https://jouw-v3-domein.vercel.app/api/generate-badge
```

Zo blijft de huidige werkende versie altijd beschikbaar.
