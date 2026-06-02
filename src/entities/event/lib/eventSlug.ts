import { TEvent } from "../model"

/** UUID в конце slug (Prisma/cuid v2 и др. часто отдают uuid) */
const TRAILING_UUID =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** CUID / короткий id без дефисов в конце slug */
const TRAILING_CUID = /-([a-z0-9]{20,32})$/i

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function eventToSlug(event: Pick<TEvent, "id" | "title">) {
  const safeTitle = slugify(event.title)
  return `${safeTitle}-${event.id}`
}

/**
 * Достаёт id события из URL-slug.
 * Раньше брался только хвост после последнего «-», из-за чего UUID обрезался
 * (например …-71d94a7706a1 вместо полного id).
 */
export function slugToEventId(slug: string) {
  const decoded = decodeURIComponent(slug).trim()

  const uuidMatch = decoded.match(TRAILING_UUID)
  if (uuidMatch) {
    return uuidMatch[0]
  }

  const cuidMatch = decoded.match(TRAILING_CUID)
  if (cuidMatch) {
    return cuidMatch[1]
  }

  const idx = decoded.lastIndexOf("-")
  if (idx === -1) {
    return decoded
  }

  return decoded.slice(idx + 1)
}

export function isEventSlugForId(slug: string, eventId: string) {
  return slugToEventId(slug) === eventId
}
