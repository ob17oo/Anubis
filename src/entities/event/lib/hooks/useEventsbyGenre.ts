'use client'

import { useCityStore } from "@/entities/city/model/city.store";
import { EventType } from "../../../../../prisma/generated/prisma/enums";
import { getEventsByGenre } from "../../api";
import { useQuery } from "@tanstack/react-query";

export function useEventsByGenre(genre?: EventType){
    const selectedCityId = useCityStore((state) => state.selectedCityId)

    const queryKey = genre ? ['events' , selectedCityId, genre] : ['events', selectedCityId]

    const queryFn = genre ? () => getEventsByGenre(selectedCityId, genre) : () => import('../../api').then((el) => el.getAllEventsByCity(selectedCityId))

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
        events: data ?? [],
        isLoading: isLoading || isRefetching,
        error: error?.message ?? null,
        isEmpty: !isLoading && (data?.length ?? 0) === 0
    }
}