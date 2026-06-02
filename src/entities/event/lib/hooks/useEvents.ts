'use client'

import { useCityStore } from "@/entities/city/model/city.store";
import { useQuery } from '@tanstack/react-query'
import { normalizeEventDates } from "../normalizeEvent";
export function useEvents() {
    const selectedCityId = useCityStore((state) => state.selectedCityId)

    const { data, error, isLoading, isRefetching } = useQuery({
        queryKey: ['events', selectedCityId],
        queryFn: async () => {
            if (!selectedCityId) return []
            const res = await fetch(`/api/events?cityId=${selectedCityId}`)
            if (!res.ok) throw new Error('Failed to fetch events')
            return res.json()
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 2,
        retryDelay: (attemtIndex) => Math.min(1000 * 2 ** attemtIndex, 30000)
    })

    return {
        events: normalizeEventDates(data ?? []),
        isLoading: isLoading || isRefetching,
        error: error?.message ?? null,
        isEmpty: !isLoading && (data?.length ?? 0) === 0
    }
}