import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface InputCompProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label: string,
    icon?: string
    inputClassName?: string
}

export function InputComp({label, icon, inputClassName, className, ...props}: InputCompProps){
    return (
        <div className={cn("relative w-full h-full", className)}>
            <input
                className={cn(
                    "w-full py-2.5 sm:py-3 text-base sm:text-lg rounded-2xl border-2 border-[#FF5100]/85 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] outline-none transition-[box-shadow,border-color] placeholder:text-foreground/35 focus:border-[#FF5100] focus:ring-4 focus:ring-[#FF5100]/15",
                    icon ? "pl-10 pr-4" : "px-4",
                    inputClassName
                )}
                placeholder={label}
                {...props}
            />
            { icon && (
                <Image className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60" width={20} height={20} src={icon} alt={`Icon ${icon}`}/>
            ) }
        </div>
    )
}
