'use client'

import { useState } from "react"
import Image from "next/image"

interface EventImageProps {
    src: string
    alt: string
    fill?: boolean
    className?: string
    priority?: boolean
}

// Toggle this constant to completely disable images and use the monotone placeholder by default
const HIDE_IMAGES_FOR_NOW = false;

export function EventImage({ src, alt, fill = false, className = "", priority = false }: EventImageProps) {
    const [hasError, setHasError] = useState(HIDE_IMAGES_FOR_NOW)

    if (hasError || !src) {
        return (
            <div className={`relative flex items-center justify-center bg-gradient-to-br from-secondary/80 to-muted/80 dark:from-secondary/30 dark:to-muted/30 border-b border-border/20 overflow-hidden ${fill ? 'absolute inset-0 w-full h-full' : 'w-full h-full'}`}>
                {/* Subtle background mesh glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                
                {/* Monotone Logo Centerpiece */}
                <div className="relative z-10 opacity-30 select-none pointer-events-none transition-opacity duration-300 hover:opacity-40 flex flex-col items-center justify-center">
                    <Image 
                        width={180} 
                        height={60} 
                        src="/static/icons/AnubisLogotype.svg" 
                        alt="Anubis Logo"
                        className="object-contain filter grayscale brightness-50 dark:brightness-200"
                    />
                </div>
            </div>
        )
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill={fill}
            className={`${className}`}
            priority={priority}
            onError={() => setHasError(true)}
        />
    )
}
