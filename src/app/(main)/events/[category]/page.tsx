import { GenrePage } from "@/view/genre"
import { EventType } from "../../../../../prisma/generated/prisma"
import { notFound } from "next/navigation"

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = await params;
    const genre = resolvedParams.category as EventType;
    
    if (!Object.values(EventType).includes(genre)) {
        notFound();
    }
    
    return <GenrePage genre={genre} />
}
