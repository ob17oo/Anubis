"use server";

import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { authOption } from "@/shared/lib/auth";
import { revalidatePath } from "next/cache";
import { EventType } from "../../../../prisma/generated/prisma";

export type EventCreateInput = {
  title: string;
  description: string;
  date: Date;
  price: number;
  genre: EventType;
  location: string;
  imageUrl: string;
  cityId: string;
  venueId: string;
};

export async function createEventAction(data: EventCreateInput) {
  const session = await getServerSession(authOption);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        price: data.price,
        genre: data.genre,
        location: data.location,
        imageUrl: data.imageUrl,
        cityId: data.cityId,
        venueId: data.venueId,
        status: "MODERATING",
        organizerId: session.user.id,
      },
    });

    const DEFAULTS: Record<string, string[]> = {
      concert: ["Стандарт", "Танцпол", "VIP", "Super VIP"],
      festival: ["Early Bird", "Стандарт", "VIP", "Premium VIP"],
      sport: ["Стандарт", "Premium", "VIP", "VIP Lounge"],
      theater: ["Балкон", "Амфитеатр", "Партер", "VIP Партер"],
      exhibition: ["Стандарт", "Расширенный доступ", "VIP", "VIP + Экскурсия"],
      conference: ["Онлайн", "Стандарт", "Business", "VIP"],
    }
    const FALLBACK = ["Стандарт", "Premium", "VIP", "Super VIP"]
    const types = DEFAULTS[data.genre] || FALLBACK

    for (let i = 0; i < types.length; i++) {
      let price = data.price || 1000
      let amount = 100

      if (i > 0) {
        price = Math.round(((data.price || 1000) * (1 + i * 0.5)) / 100) * 100
        amount = Math.max(10, Math.floor(100 / (i + 1)))
      }

      await prisma.ticketType.create({
        data: {
          eventId: event.id,
          name: types[i],
          price: price,
          capacity: amount,
          soldCount: 0
        }
      })
    }

    revalidatePath("/organizer/events");
    revalidatePath("/admin/events");
    return { success: true, eventId: event.id };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Не удалось создать событие." };
  }
}
