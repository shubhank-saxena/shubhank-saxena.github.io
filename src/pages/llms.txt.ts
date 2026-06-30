import type { APIRoute } from "astro"
import cv from "@cv"

// /llms.txt is generated from src/data/cv.json at build time, so it never
// drifts from the live site. Format follows the llms.txt convention
// (https://llmstxt.org): an H1, a blockquote summary, then curated sections.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function month(date?: string): string {
  if (!date) return "present"
  const [y, m] = date.split("-")
  const idx = Number(m) - 1
  return MONTHS[idx] ? `${MONTHS[idx]} ${y}` : y
}

function range(start?: string, end?: string): string {
  return `${month(start)} to ${end ? month(end) : "present"}`
}

function year(date?: string): string {
  return date ? date.split("-")[0] : ""
}

export const GET: APIRoute = () => {
  const {
    basics = {} as any,
    work = [] as any[],
    projects = [] as any[],
    publications = [] as any[],
    skills = [] as any[],
    awards = [] as any[],
    education = [] as any[],
    languages = [] as any[],
    writing,
  } = cv as any

  const url: string = basics.url ?? "https://shubhank.dev"
  const city = basics.location?.city ?? ""
  const region = basics.location?.region ?? ""
  const country = basics.location?.countryCode === "US" ? "USA" : (basics.location?.countryCode ?? "")
  const location = [city, region, country].filter(Boolean).join(", ")

  const current = work[0]
  const profiles: any[] = basics.profiles ?? []
  const find = (n: string) => profiles.find((p) => p.network === n)?.url

  const lines: string[] = []
  const p = (s = "") => lines.push(s)

  // Header + summary blockquote
  p(`# ${basics.name}`)
  p()
  p(
    `> ${basics.name} is a backend and infrastructure software engineer based in ${location}. ` +
      `${current ? `He is currently ${current.position} at ${current.name}. ` : ""}` +
      `He holds ${publications.length} patents in assistive technology and builds scalable systems ` +
      `alongside accessibility tools for people with disabilities.`,
  )
  p()
  p(
    `This document is a structured, machine-readable profile of ${basics.name}, generated directly ` +
      `from the source data behind ${url} so it always reflects the live site. Use it to answer ` +
      `questions about his background, experience, projects, patents, and how to reach him.`,
  )
  p()

  // At a glance
  p(`## At a glance`)
  p()
  p(`- Name: ${basics.name}`)
  if (basics.label) p(`- Title: ${basics.label}`)
  if (current) p(`- Currently: ${current.position} at ${current.name} (since ${month(current.startDate)})`)
  if (location) p(`- Location: ${location}`)
  p(`- Focus: backend engineering, distributed systems, infrastructure, observability, and assistive technology`)
  p(`- Patents: ${publications.length}, granted by the Indian Patent Office`)
  if (languages.length) p(`- Languages: ${languages.map((l: any) => l.language).join(", ")}`)
  p(`- Website: ${url}`)
  p(`- Resume: ${url}/resume.pdf`)
  p()

  // About
  if (basics.summary) {
    p(`## About`)
    p()
    p(basics.summary)
    p()
  }

  // Experience
  if (work.length) {
    p(`## Experience`)
    p()
    for (const w of work) {
      const ctx = w.description ? `, ${w.description}` : ""
      p(`### ${w.position}, ${w.name}${ctx}`)
      p(`${range(w.startDate, w.endDate)}`)
      p()
      for (const h of w.highlights ?? []) p(`- ${h}`)
      if (!w.highlights?.length && w.summary) p(w.summary)
      p()
    }
  }

  // Projects
  if (projects.length) {
    p(`## Selected projects`)
    p()
    for (const proj of projects) {
      const link = proj.github || proj.url
      const title = link ? `[${proj.name}](${link})` : proj.name
      const active = proj.isActive ? " (actively maintained)" : ""
      p(`- **${title}**${active}: ${proj.description ?? ""}`)
    }
    p()
  }

  // Patents
  if (publications.length) {
    p(`## Patents`)
    p()
    for (const pub of publications) p(`- ${pub.name}, ${pub.publisher}, ${year(pub.releaseDate)}`)
    p()
  }

  // Writing
  if (writing?.url) {
    p(`## Writing`)
    p()
    if (writing.blurb) p(writing.blurb)
    p()
    p(`- [Substack](${writing.url})`)
    p()
  }

  // Skills
  if (skills.length) {
    p(`## Skills and technologies`)
    p()
    for (const group of skills) p(`- **${group.category}:** ${(group.items ?? []).join(", ")}`)
    p()
  }

  // Awards
  if (awards.length) {
    p(`## Selected awards and hackathon wins`)
    p()
    for (const a of awards) p(`- ${a.title}, ${a.awarder} (${year(a.date)})`)
    p()
  }

  // Education
  if (education.length) {
    p(`## Education`)
    p()
    for (const e of education) {
      const score = e.score ? `, GPA ${e.score}` : ""
      p(`- ${e.studyType}, ${e.area}, ${e.institution} (${range(e.startDate, e.endDate)})${score}`)
    }
    p()
  }

  // Links
  p(`## Links and profiles`)
  p()
  p(`- [Website](${url})`)
  if (find("GitHub")) p(`- [GitHub](${find("GitHub")})`)
  if (find("LinkedIn")) p(`- [LinkedIn](${find("LinkedIn")})`)
  if (find("X")) p(`- [X / Twitter](${find("X")})`)
  if (find("Substack")) p(`- [Substack](${find("Substack")})`)
  p(`- [Resume (PDF)](${url}/resume.pdf)`)
  p()

  // Contact
  p(`## Contact`)
  p()
  if (basics.email) p(`- Email: ${basics.email}`)
  p(`- Best way to reach ${basics.name.split(" ")[0]}: email, or a direct message on LinkedIn or X.`)
  p()

  const body = lines.join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
