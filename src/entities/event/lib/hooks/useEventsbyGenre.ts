'use client'

import { useCityStore } from "@/entities/city/model/city.store";
import { EventType } from "../../../../../prisma/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { normalizeEventDates } from "../normalizeEvent";

export function useEventsByGenre(genre?: EventType){
    const selectedCityId = useCityStore((state) => state.selectedCityId)

    const queryKey = genre ? ['events' , selectedCityId, genre] : ['events', selectedCityId]

    const queryFn = async () => {
        if (!selectedCityId) return []
        const params = new URLSearchParams({ cityId: selectedCityId })
        if (genre) params.append('genre', genre)
        
        const res = await fetch(`/api/events?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch events')
        return res.json()
    }

    const { data,error, isLoading, isRefetching } = useQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 2,

        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    })

    return {
        events: normalizeEventDates(data ?? []),
        isLoading: isLoading || isRefetching,
        error: error?.message ?? null,
        isEmpty: !isLoading && (data?.length ?? 0) === 0
    }
}