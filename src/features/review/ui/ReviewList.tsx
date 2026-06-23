import { StarIcon } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import Image from "next/image"

interface ReviewWithUser {
  id: string
  rating: number
  text: string | null
  createdAt: Date
  user: {
    userName: string
    imageUrl: string
  }
}

interface ReviewListProps {
  reviews: ReviewWithUser[]
  averageRating: number
}

export function ReviewList({ reviews, averageRating }: ReviewListProps) {
  return (
    <section className="glass-panel p-6 sm:p-8 rounded-3xl mt-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-border/50">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Отзывы пользователей</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {reviews.length} {reviews.length === 1 ? "отзыв" : reviews.length > 1 && reviews.length < 5 ? "отзыва" : "отзывов"} оставлено для этого события
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center sm:text-right">
            <span className="text-4xl font-black font-heading text-foreground">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm font-medium"> / 5</span>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`size-5 ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground text-center sm:text-left mt-1 font-medium">Рейтинг события</span>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground flex flex-col items-center gap-2">
          <p className="text-lg font-medium">Отзывов пока нет</p>
          <p className="text-sm max-w-xs leading-relaxed text-muted-foreground/75">
            Будьте первым, кто поделится своим мнением и поможет другим с выбором!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review) => {
            const reviewDate = new Date(review.createdAt)
            return (
              <div
                key={review.id}
                className="p-5 glass-card border border-border/30 rounded-2xl flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-md hover:border-border/60 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-full overflow-hidden border border-border bg-secondary flex items-center justify-center">
                      {review.user.imageUrl ? (
                        <Image
                          src={review.user.imageUrl}
                          alt={review.user.userName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          {review.user.userName[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-sm">
                        {review.user.userName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(reviewDate, "d MMMM yyyy, HH:mm", { locale: ru })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-0.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/40">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`size-3.5 ${
                          star <= review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {review.text && (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap pl-1">
                    {review.text}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
