# shubhank.dev

Source for my personal site, a single-page portfolio built with [Astro](https://astro.build).

All content is data-driven from a single file, [`src/data/cv.json`](src/data/cv.json); the components in `src/components/sections/` render it.

## Develop

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

## Structure

- `src/data/cv.json`: all site content (the file I usually edit)
- `src/components/sections/`: one component per section (Hero, About, Work, Projects, etc.)
- `src/pages/index.astro`: page composition and section order
- `src/layouts/Layout.astro`: document shell, fonts, global styles
- `public/`: static assets (profile image, résumé PDF, favicon)

## Credits

Originally scaffolded from the [astrolio](https://github.com/dakodonnell/astrolio) template, since modified.
