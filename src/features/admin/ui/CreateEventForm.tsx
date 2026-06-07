"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { supabase } from "@/shared/lib/supabase";
import { createEventAction } from "../action/event.action";
import { ImageUpload } from "@/shared/ui";
import { EventType } from "../../../../prisma/generated/prisma";
import { Loader2 } from "lucide-react";
import { useCities } from "@/entities/city/lib/hooks";
import { useVenues } from "@/entities/venue/lib/hooks";

// Schema for form validation
const eventSchema = z.object({
  title: z.string().min(3, "Название должно быть не короче 3 символов"),
  description: z.string().min(10, "Описание должно быть не короче 10 символов"),
  genre: z.nativeEnum(EventType, {
    message: "Выберите корректную категорию"
  }),
  date: z.string().min(1, "Обязательное поле"),
  price: z.number().min(0, "Цена не может быть отрицательной"),
  cityId: z.string().min(1, "Выберите город"),
  venueId: z.string().min(1, "Выберите место проведения"),
  imageFile: z.any().refine((val) => val instanceof File, "Необходимо загрузить изображение")
});

type EventFormValues = z.infer<typeof eventSchema>;

export function CreateEventForm() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      genre: "concert",
      cityId: "",
      venueId: "",
    }
  });

  const imageFile = watch("imageFile");
  const selectedCityId = watch("cityId");

  const { cities, isLoading: isCitiesLoading } = useCities();
  const { venues, isLoading: isVenuesLoading } = useVenues(selectedCityId);

  const onSubmit = async (data: EventFormValues) => {
    setGlobalError(null);
    setIsUploading(true);

    try {
      const file = data.imageFile;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Ошибка загрузки изображения: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      const selectedVenue = venues.find((v: { id: string; name: string }) => v.id === data.venueId);
      const venueName = selectedVenue ? selectedVenue.name : "";

      const result = await createEventAction({
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        price: data.price,
        genre: data.genre,
        location: venueName,
        imageUrl: publicUrl,
        cityId: data.cityId,
        venueId: data.venueId,
      });

      if (result.success) {
        router.push("/organizer/events");
      } else {
        throw new Error(result.error || "Неизвестная ошибка при создании");
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Произошла ошибка при сохранении");
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = isSubmitting || isUploading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 rounded-3xl flex flex-col gap-6 shadow-xl relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center text-primary">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-medium">{isUploading ? "Загрузка изображения..." : "Сохранение события..."}</p>
        </div>
      )}

      {globalError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm font-medium">
          {globalError}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium opacity-80">Превью мероприятия</label>
        <ImageUpload
          value={imageFile}
          onChange={(file) => setValue("imageFile", file, { shouldValidate: true })}
          disabled={isLoading}
        />
        {errors.imageFile && <p className="text-destructive text-sm mt-1">{errors.imageFile.message as string}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium opacity-80">Название события</label>
        <input 
          {...register("title")} 
          type="text" 
          disabled={isLoading}
          className={`w-full rounded-2xl bg-surface border px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.title ? "border-destructive focus:ring-destructive/50" : "border-border"}`} 
          placeholder="Например: Концерт Rock Band" 
        />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium opacity-80">Категория</label>
        <select 
          {...register("genre")} 
          disabled={isLoading}
          className={`w-full rounded-2xl bg-surface border px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.genre ? "border-destructive focus:ring-destructive/50" : "border-border"}`}
        >
          <option value="concert">Концерт</option>
          <option value="festival">Фестиваль</option>
          <option value="theater">Театр</option>
          <option value="cinema">Кино</option>
          <option value="standup">Стендап</option>
          <option value="sport">Спорт</option>
          <option value="exhibition">Выставка</option>
          <option value="conference">Конференция</option>
          <option value="kids">Детям</option>
        </select>
        {errors.genre && <p className="text-destructive text-sm">{errors.genre.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium opacity-80">Описание</label>
        <textarea 
          {...register("description")} 
          rows={5} 
          disabled={isLoading}
          className={`w-full rounded-2xl bg-surface border px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hide-scrollbar ${errors.description ? "border-destructive focus:ring-destructive/50" : "border-border"}`} 
          placeholder="Подробное описание программы..."
        />
        {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium opacity-80">Дата и время</label>
          <input 
            {...register("date")} 
            type="datetime-local" 
            disabled={isLoading}
            className={`w-full rounded-2xl bg-surface border px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.date ? "border-destructive focus:ring-destructive/50" : "border-border"}`} 
          />
          {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium opacity-80">Цена билета (₽)</label>
          <input 
            {...register("price", { valueAsNumber: true })} 
            type="number" 
            min="0" 
            disabled={isLoading}
            className={`w-full rounded-2xl bg-surface border px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.price ? "border-destructive focus:ring-destructive/50" : "border-border"}`} 
            placeholder="1500" 
          />
          {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium opacity-80">Город</label>
          <select 
            {...register("cityId", {
              onChange: () => {
                setValue("venueId", "", { shouldValidate: true });
              }
            })}
            disabled={isLoading || isCitiesLoading}
            className={`w-full rounded-2xl bg-surface border px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.cityId ? "border-destructive focus:ring-destructive/50" : "border-border"}`}
          >
            <option value="">Выберите город</option>
            {cities.map((city: { id: string; name: string }) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          {errors.cityId && <p className="text-destructive text-sm">{errors.cityId.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium opacity-80">Место проведения (Площадка)</label>
          <select 
            {...register("venueId")} 
            disabled={isLoading || !selectedCityId || isVenuesLoading}
            className={`w-full rounded-2xl bg-surface border px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.venueId ? "border-destructive focus:ring-destructive/50" : "border-border"}`}
          >
            <option value="">Выберите площадку</option>
            {venues.map((venue: { id: string; name: string; address?: string }) => (
              <option key={venue.id} value={venue.id}>{venue.name} {venue.address ? `(${venue.address})` : ""}</option>
            ))}
            {venues.length === 0 && selectedCityId && !isVenuesLoading && (
              <option value="" disabled>Площадки не найдены</option>
            )}
          </select>
          {errors.venueId && <p className="text-destructive text-sm">{errors.venueId.message}</p>}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground font-bold text-lg py-5 rounded-2xl mt-4 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Отправить на модерацию
      </button>
    </form>
  );
}
