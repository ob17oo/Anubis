import { EventType } from "../../../../../prisma/generated/prisma";

export interface TEvent {
    id: string,
    title: string,
    description: string,
    imageUrl: string, 
    location: string,
    date: Date | string,
    price: number,
    ticketAmount: number,
    genre: EventType
    createdAt: Date,
    updatedAt?: Date | null,

    rating: number,
}