'use client'

import { useQuery } from "@tanstack/react-query"
import { getVenuesByCity } from "../../api/getVenues.api"

export function useVenues(cityId?: string) {
    const { data, error, isLoading } = useQuery({
        queryKey: ['venues', cityId],
        queryFn: () => cityId ? getVenuesByCity(cityId) : Promise.resolve([]),
        enabled: !!cityId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2
    })

    return {
        venues: data ?? [],
        isLoading,
        error: error?.message ?? null
    }
}
