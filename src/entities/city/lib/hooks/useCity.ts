'use client'

import { useQuery } from "@tanstack/react-query"
import { getAllCities } from "../../api"

export function useCities() {

    const { data, error, isLoading } = useQuery({
        queryKey: ['cities'],
        queryFn: () => getAllCities(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2
    })

    return {
        cities: data ?? [],
        isLoading,
        error: error?.message ?? null
    }
}