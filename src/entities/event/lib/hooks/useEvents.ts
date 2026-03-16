'use client'

import { useCityStore } from "@/entities/city/model/city.store";
import { useQuery } from '@tanstack/react-query'
import { getAllEventsByCity } from "../../api";
export function useEvents() {
    const selectedCityId = useCityStore((state) => state.selectedCityId)

    const { data, error, isLoading, isRefetching } = useQuery({
        queryKey: ['events', selectedCityId],
        queryFn: () => getAllEventsByCity(selectedCityId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 2,
        retryDelay: (attemtIndex) => Math.min(1000 * 2 ** attemtIndex, 30000)
    })

    return {
        events: data ?? [],
        isLoading: isLoading || isRefetching,
        error: error?.message ?? null,
        isEmpty: !isLoading && (data?.length ?? 0) === 0
    }
}