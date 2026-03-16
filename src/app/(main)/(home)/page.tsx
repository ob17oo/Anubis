'use client'

import { HomePage } from "@/view";
import { useEvents } from "@/entities/event/lib/hooks"

export default function Home(){
  const { events, isLoading, error, isEmpty } = useEvents()
  return <HomePage
    events={events}
    isLoading={isLoading}
    error={error}
    isEmpty={isEmpty}
  />
}