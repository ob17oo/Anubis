export function EventCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 h-80 rounded-lg mb-4"></div>
      <div className="bg-gray-300 h-8 rounded w-3/4 mb-2"></div>
      <div className="bg-gray-300 h-4 rounded w-1/2"></div>
    </div>
  )
}