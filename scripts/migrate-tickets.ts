import { prisma } from '../src/shared/lib/prisma'

const DEFAULTS: Record<string, string[]> = {
  concert: ["Стандарт", "Танцпол", "VIP", "Super VIP"],
  festival: ["Early Bird", "Стандарт", "VIP", "Premium VIP"],
  sport: ["Стандарт", "Premium", "VIP", "VIP Lounge"],
  theater: ["Балкон", "Амфитеатр", "Партер", "VIP Партер"],
  exhibition: ["Стандарт", "Расширенный доступ", "VIP", "VIP + Экскурсия"],
  conference: ["Онлайн", "Стандарт", "Business", "VIP"],
}

const FALLBACK = ["Стандарт", "Premium", "VIP", "Super VIP"]

async function main() {
  console.log("Starting data migration for ticket types...")

  const events = await prisma.event.findMany({
    include: { tickets: true, ticketTypes: true }
  })

  for (const event of events) {
    if (event.ticketTypes.length > 0) {
      console.log(`Event ${event.title} already has ticket types. Skipping.`)
      continue
    }

    const types = DEFAULTS[event.genre] || FALLBACK

    // First type inherits existing price and amount
    const firstTypePrice = event.price
    const firstTypeAmount = event.ticketAmount || 100

    const createdTypes = []

    for (let i = 0; i < types.length; i++) {
      let price = firstTypePrice
      let amount = firstTypeAmount

      if (i > 0) {
        // Generate pseudo-random realistic prices and amounts for other categories
        price = Math.round((firstTypePrice * (1 + i * 0.5)) / 100) * 100
        amount = Math.max(10, Math.floor(firstTypeAmount / (i + 1)))
      }

      const tType = await prisma.ticketType.create({
        data: {
          eventId: event.id,
          name: types[i],
          price: price,
          capacity: amount,
          soldCount: 0 // We'll recalculate this later if needed
        }
      })
      createdTypes.push(tType)
    }

    // Now update existing tickets to point to the "Standard" (first) type
    const standardType = createdTypes[0]

    let soldCount = 0

    if (event.tickets.length > 0) {
      for (const ticket of event.tickets) {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { ticketTypeId: standardType.id }
        })
        soldCount += ticket.quantity
      }
    }

    if (soldCount > 0) {
      await prisma.ticketType.update({
        where: { id: standardType.id },
        data: { soldCount: soldCount }
      })
    }

    console.log(`Migrated event: ${event.title}`)
  }

  console.log("Migration complete.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
