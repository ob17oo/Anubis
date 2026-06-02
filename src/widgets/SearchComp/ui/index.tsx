'use client'

import { InputComp } from "@/shared/ui"
import { XIcon } from "lucide-react"

interface SearchCompProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function SearchComp({
    value,
    onChange,
    placeholder = "Поиск событий, мест, артистов…",
}: SearchCompProps) {
    return (
        <div className="relative w-full">
            <InputComp
                label={placeholder}
                icon="/static/icons/search.svg"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Поиск событий"
            />
            {value.length > 0 && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-foreground/50 hover:bg-[#FF5100]/10 hover:text-[#FF5100] transition-colors"
                    aria-label="Очистить поиск"
                >
                    <XIcon className="size-4" />
                </button>
            )}
        </div>
    )
}
