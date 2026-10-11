# Anton Salvador's website

Personal portfolio for engineering projects, writing, and travel photography.

Built with Astro, TypeScript, and CSS. Static hosting target: Vercel at `antonsalvador.cc`.

Requires Node.js 22.12 or later (Node 24 supported).

```sh
npm install
npm run dev
npm run check
npm test
npm run build
npm run preview
```

Project accounts live in `src/content/projects/`. Add future writing to `src/content/blog/` as Markdown with `title`, `description`, `publicationDate`, and `draft` frontmatter. Posts default to draft and are excluded from both listings and generated routes until `draft: false` is set.

Site identity and optional contact links live in `src/data/site.ts`. Contact links and travel photos will be added when supplied. The current illustration and travel foundation are being developed locally; publishing and domain setup are separate steps.

Personal source documents, internal planning notes, credentials, generated files, and browser test output are excluded from version control.
