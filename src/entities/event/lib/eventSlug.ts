import { TEvent } from "../model"

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function eventToSlug(event: Pick<TEvent, "id" | "title">) {
  const safeTitle = slugify(event.title)
  return `${safeTitle}-${event.id}`
}

export function slugToEventId(slug: string) {
  const idx = slug.lastIndexOf("-")
  if (idx === -1) return slug
  return slug.slice(idx + 1)
}

