'use client'

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center glass-panel rounded-3xl max-w-2xl mx-auto mt-20">
      <div className="size-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-3xl font-heading font-bold mb-4">Что-то пошло не так</h2>
      <p className="text-muted-foreground mb-8">
        Произошла непредвиденная ошибка при загрузке данных. Мы уже уведомлены и разбираемся.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  )
}
