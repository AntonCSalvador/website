# Hero artwork

Original landscape and cloud generated with OpenAI's built-in image generation on 2026-10-11 for Anton Salvador's approved illustrated basecamp direction B. The landscape is decorative artwork, not a photograph of Anton's travels.

`basecamp.webp`: 1536 × 1024, WebP quality 83. `cloud.webp`: 900 × 300, WebP quality 80 with transparency. Converted with Astro's existing Sharp dependency. The exact generation prompt is embedded in each shipping WebP's EXIF ImageDescription. Impeccable `embed-prompt` additionally records the prompt in its WebP sidecar fallback; read it with `impeccable embed-prompt <file> --read`.

Source PNGs and their embedded exact prompts remain in the local `.impeccable/assets/` folder. Site artwork uses the optimized originals directly so their provenance metadata survives in the published assets.
