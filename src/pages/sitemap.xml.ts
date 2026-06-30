import type { APIRoute } from "astro"
import cv from "@cv"

// Minimal sitemap for a single-page site, generated so the canonical domain
// comes straight from cv.json.

export const GET: APIRoute = () => {
  const url: string = (cv as any).basics?.url ?? "https://shubhank.dev"
  const lastmod = new Date().toISOString().split("T")[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
