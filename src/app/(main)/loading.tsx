export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <div className="size-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-6 text-muted-foreground font-medium animate-pulse">Загрузка данных...</p>
    </div>
  )
}
