# Anton Salvador's website

An Astro, TypeScript, and CSS portfolio for engineering projects, writing, and travel photography. The site builds to static files; it needs no database, API keys, or hosted map service.

## ASCII hero

The hero renders seven user-supplied photos at 144 × 108 character samples. Only derived brightness data in `src/data/hero-frames.json` ships; the original photos and EXIF/location metadata do not. The first frame has a static SVG-text fallback without JavaScript. Canvas animation respects reduced motion, explicit pause, offscreen visibility, and hidden tabs.

Originals stay in ignored `incoming/hero-photos/`. To regenerate the committed data after editing the source list in `scripts/prepare-hero.mjs`, run `node scripts/prepare-hero.mjs`. Normal builds do not need the originals. The render is derived from the supplied photos, not generated imagery; the optional local comparison at port 4323 is not a site route.

## Run locally

Use Node.js 24 or later and an installed Google Chrome for browser checks.

```sh
npm ci
npm run dev
```

Astro prints the local address, normally `http://localhost:4321`. Stop this server before running the automated browser command, which reserves ports 4321 and 4322.

```sh
npm run check
npm test
npm run test:browser
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

`npm test` runs native Node tests, including a temporary build that confirms a published first post appears while a draft stays private. Its fixtures and temporary output are removed afterward.

`npm run test:browser` runs content, travel, and gallery checks against dev at `http://127.0.0.1:4322`, removes its fixture page/photo/project, builds production, then runs hero checks against preview at `http://127.0.0.1:4321`. It reuses servers at these addresses or starts and stops its own. Run it from the repository root on Windows, macOS, or Linux. Don't run builds or other fixture tests concurrently.

For individual browser checks, first start both servers (build before preview):

```sh
npm run dev -- --host 127.0.0.1 --port 4322
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
node --test tests/hero-motion.browser.ts
node --test tests/travel.browser.ts
node --test tests/gallery.browser.ts
```

Keep each server in a separate terminal. The gallery check temporarily copies a synthetic SVG and page from `tests/fixtures/`, then deletes them. Rebuild after individual fixture checks before publishing.

## Add a project

Create `src/content/projects/your-project.md`. The filename becomes `/projects/your-project/`:

```yaml
---
title: Your project
summary: A short, factual account of the problem and contribution.
role: Your role
order: 3
technologies:
  - TypeScript
---
```

Write the full account below the frontmatter using Markdown. Projects are sorted by `order`; new homepage entries use their own `summary`. The two existing projects have tailored homepage accounts. Only add supported results. Preserve the private `projects/` source folder; published content belongs in `src/content/projects/`.

## Add writing

Create `src/content/blog/your-post.md` for `/blog/your-post/`:

```yaml
---
title: Your post
description: A short description
publicationDate: 2026-10-11
draft: true
---
```

Add Markdown below the frontmatter. Set `draft: false` when ready to publish; drafts are excluded from listings and generated routes. Published posts appear newest first. Restart dev after adding the first post to the currently empty collection. No posts are published yet, so the blog intentionally shows “Writing soon.”

## Add destinations and photos

Edit `src/data/trips.ts`. A trip has a stable `id`, `name`, `year`, geographic `longitude` and `latitude`, optional `note`, and `photos`. Use verified coordinates; the Iceland marker represents the country until specific stops are supplied. The existing map is framed for the five current destinations; adding trips outside its geographic bounds also requires adjusting the projection and local map data.

Place real photos in `public/photos/` and add metadata to the destination:

```ts
photos: [{
  src: '/photos/boston-harbor.webp',
  alt: 'Describe what is visible in this actual photo.',
  width: 1600,
  height: 1067,
  caption: 'An optional truthful caption.',
}]
```

Use optimized WebP/JPEG files, correct intrinsic dimensions, and meaningful alt text. Thumbnails lazy-load; selecting one opens a keyboard-accessible enlarged-photo dialog. Without JavaScript, thumbnails still link to the original image. Anton's travel photos have not been supplied: all five galleries currently show “Photos coming soon.” The synthetic browser fixture is not portfolio photography and never belongs in a production build.

## Identity, contacts, and artwork

`src/data/site.ts` holds the site name, canonical URL, email, GitHub, and LinkedIn. The confirmed contacts are configured; removing an optional contact field removes its link. Update `url` if the final public hostname changes.

The basecamp, cloud, and hiker are original generated decorative artwork, distinct from travel photos. Exact generation prompts accompany the assets. Geography uses Natural Earth's public-domain country data, with verified representative destination markers. Details are in `src/assets/hero/PROVENANCE.md` and `src/assets/travel/PROVENANCE.md`. `node scripts/prepare-hero-assets.mjs` regenerates responsive landscape sources and provenance; ordinary builds need no network access. The travel asset preparation script downloads geography and is only needed when updating those assets.

## Publish separately on Vercel

After local review, push the intended branch to your Git provider and import the repository in Vercel. Select the Astro preset, Node.js 24, install command `npm ci`, build command `npm run build`, and output directory `dist`. No environment variables are required. Check preview routes and contact links before promoting it to production.

Then add `antonsalvador.cc` in the project's Domains settings and apply the DNS records Vercel provides through your registrar. Confirm HTTPS and the canonical hostname after DNS resolves. Deployment and DNS changes are separate from the local implementation; neither has been performed here.

Personal source documents, planning notes, credentials, build output, and local review captures remain excluded from version control and the static site.
