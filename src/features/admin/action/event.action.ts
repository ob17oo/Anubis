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

    revalidatePath("/organizer/events");
    revalidatePath("/admin/events");
    return { success: true, eventId: event.id };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Не удалось создать событие." };
  }
}
