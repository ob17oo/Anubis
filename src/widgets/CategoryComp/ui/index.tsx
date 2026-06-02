'use client'
import Link from "next/link";
import { HEADER_CATEGORY } from "../model/category.constant";
import { usePathname } from "next/navigation";

export function Category(){
    const currentPath = usePathname()
    return (
        <div className="flex items-center gap-4 w-full h-16 overflow-x-auto hide-scrollbar px-6 mt-4">
            { HEADER_CATEGORY.map((element) => (
                <Link 
                    className={`text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 whitespace-nowrap ${
                        element.path === currentPath 
                            ? 'bg-foreground text-background shadow-md' 
                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
                    }`} 
                    key={element.value} 
                    href={element.path}
                >
                    {element.value}
                </Link>
            ))}
        </div>
    )
}