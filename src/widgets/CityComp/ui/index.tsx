"use client";

import { updateUserCity } from "@/entities/city/api";
import { useCityStore } from "@/entities/city/model/city.store";
import { TUserCity } from "@/entities/city/model/city.types";

import { InputComp } from "@/shared/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useMemo, useState, useTransition, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface CityPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    city: TUserCity[];
}

export function CityDialogComp({isOpen, onClose, city}: CityPopUpProps){
    const {data: session, update} = useSession();
    const queryClient = useQueryClient();
    const { selectedCityId, setSelectedCity, selectedCityName } = useCityStore();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [updatingCityId, setUpdatingCityId] = useState<string | null>(null);
    
    // Manage native dialog open/close state
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    // Handle close from native dialog escape key
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = () => {
            onClose();
        };

        dialog.addEventListener("close", handleClose);
        return () => dialog.removeEventListener("close", handleClose);
    }, [onClose]);

    // Light dismiss
    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const filteredCity = useMemo(() => {
        if(!search.trim()) return city;
        return city.filter((el) => el.name.toLowerCase().includes(search.toLowerCase()));
    }, [city, search]);

    const handleChangeCity = async (cityId: string, cityName: string) => {
        if (isPending) return;

        setUpdatingCityId(cityId);

        startTransition(async () => {
            try {
                const result = await updateUserCity(cityId);

                if(result.success){
                    setSelectedCity(cityId, cityName);
                    if(session?.user?.id){
                        await update();
                        router.refresh();
                    }
                    
                    setSearch('');
                    queryClient.invalidateQueries({queryKey: ['events']});
                    onClose();
                }
            } catch(error: unknown){
                // Ignore update error
                console.error("Failed to update city", error);
            } finally {
                setUpdatingCityId(null);
            }
        });
    };

    return (
        <dialog 
            ref={dialogRef}
            onClick={handleBackdropClick}
            className="backdrop:bg-black/30 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95 bg-transparent m-auto p-0 border-none rounded-2xl outline-none"
        >
            <div className="glass-card rounded-3xl w-[90vw] max-w-sm sm:w-80 px-6 pt-8 pb-6 flex flex-col gap-6 relative overflow-hidden text-card-foreground">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary/80 transition-colors cursor-pointer text-muted-foreground z-10" 
                    type="button"
                    aria-label="Закрыть"
                    disabled={isPending}
                >
                    <Image width={20} height={20} src={'/static/icons/close-cross_accent.svg'} alt="CloseCity" className="opacity-70 hover:opacity-100 transition-opacity" />
                </button>
                
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                        <Image width={28} height={28} src={'/static/icons/map-location_accent.svg'} alt="UserCityPointer"/>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Ваш город</p>
                        <p className="text-xl font-bold leading-tight">{session?.user?.city?.name || selectedCityName}</p>
                    </div>
                </div>

                <div className="relative">
                    <InputComp value={search} onChange={(e) => setSearch(e.target.value)} label='Поиск города' disabled={isPending} />
                </div>
                
                <div className="flex flex-col gap-1 h-[45vh] sm:h-[320px] overflow-y-auto hide-scrollbar -mx-2 px-2 relative z-0">
                    {filteredCity.length > 0 ? (
                        filteredCity.map((el) => {
                            const isUpdatingThis = isPending && updatingCityId === el.id;
                            return (
                                <button 
                                    onClick={() => handleChangeCity(el.id, el.name)} 
                                    className="flex items-center justify-between text-left cursor-pointer px-4 py-3.5 rounded-2xl hover:bg-secondary/50 focus:bg-secondary/50 focus:outline-none transition-all group disabled:opacity-50 disabled:cursor-not-allowed" 
                                    key={el.id} 
                                    type="button"
                                    disabled={isPending}
                                >
                                    <span className="text-[1.05rem] font-medium group-hover:text-primary transition-colors">{el.name}</span>
                                    {isUpdatingThis ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-primary/0 group-hover:bg-primary/50 transition-colors" />
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-70">
                            <p className="text-muted-foreground text-lg">Город не найден</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">Попробуйте изменить запрос</p>
                        </div>
                    )}
                </div>

                {isPending && !updatingCityId && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-3xl">
                        <div className="glass-panel p-4 rounded-full">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    </div>
                )}
            </div>
        </dialog>
    );
}