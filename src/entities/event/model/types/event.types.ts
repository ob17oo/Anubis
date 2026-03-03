import { EventType } from "../../../../../prisma/generated/prisma/enums";

export interface TEvent {
    id: string,
    title: string,
    description: string,
    imageUrl: string, 
    location: string,
    date: Date,
    price: number,
    ticketAmount: number,
    genre: EventType
    createdAt: Date,
    updatedAt?: Date | null,

    rating: number,
}