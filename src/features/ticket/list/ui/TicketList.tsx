'use client'

import { useState } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, MapPinIcon, QrCodeIcon, XIcon } from "lucide-react"
import { EventImage } from "@/entities/event/ui/event-image"
import { RefundForm } from "@/features/ticket/return/ui/RefundForm"
import { useRouter } from "next/navigation"

export type TicketItem = {
    id: string
    quantity: number
    totalPrice: number
    status: string
    createdAt: Date
    qrCode: string | null
    event: {
        id: string
        title: string
        imageUrl: string
        date: Date
        location: string | null
        genre: string
    }
    refundRequest?: {
        id: string
        reason: string
        status: "PENDING" | "APPROVED" | "REJECTED"
        createdAt: Date | string
    } | null
}

interface TicketListProps {
    tickets: TicketItem[]
}

export function TicketList({ tickets }: TicketListProps) {
    const router = useRouter()
    const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null)
    const [showRefundForm, setShowRefundForm] = useState(false)

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tickets.map((ticket) => (
                    <div 
                        key={ticket.id} 
                        onClick={() => {
                            setSelectedTicket(ticket)
                            setShowRefundForm(false)
                        }}
                        className="relative flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer select-none"
                    >
                        {/* Верхняя часть билета (Событие) */}
                        <div className="glass-panel bg-card border-border rounded-t-3xl overflow-hidden flex flex-col relative z-10 border-b-2 border-dashed border-border/50">
                            <div className="relative w-full aspect-[16/9]">
                                <EventImage
                                    src={ticket.event.imageUrl}
                                    alt={ticket.event.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className={`absolute top-4 right-4 bg-background/95 backdrop-blur px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border z-20 ${
                                    ticket.status === 'CANCELLED' 
                                        ? 'text-muted-foreground border-muted/30' 
                                        : ticket.refundRequest?.status === 'PENDING' 
                                        ? 'text-amber-500 border-amber-500/30' 
                                        : ticket.refundRequest?.status === 'REJECTED' 
                                        ? 'text-destructive border-destructive/30' 
                                        : 'text-emerald-500 border-emerald-500/30'
                                }`}>
                                    {ticket.status === 'CANCELLED' 
                                        ? 'Возвращен' 
                                        : ticket.refundRequest?.status === 'PENDING' 
                                        ? 'Возврат: В обработке' 
                                        : ticket.refundRequest?.status === 'REJECTED' 
                                        ? 'Возврат: Отказан' 
                                        : 'Подтвержден'}
                                </div>
                                <h3 className="absolute bottom-4 left-6 right-6 text-2xl font-heading font-bold text-white leading-tight">
                                    {ticket.event.title}
                                </h3>
                            </div>
                            
                            <div className="p-6 flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <CalendarIcon className="size-4 text-primary" />
                                    <span className="font-medium text-foreground">
                                        {format(new Date(ticket.event.date), "d MMMM yyyy, HH:mm", { locale: ru })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <MapPinIcon className="size-4 text-accent" />
                                    <span className="font-medium text-foreground">
                                        {ticket.event.location || 'Место уточняется'}
                                    </span>
                                </div>
                            </div>
                            {/* Вырезы (перфорация) по бокам */}
                            <div className="absolute -bottom-3 -left-3 size-6 rounded-full bg-background border border-border/50 z-20"></div>
                            <div className="absolute -bottom-3 -right-3 size-6 rounded-full bg-background border border-border/50 z-20"></div>
                        </div>
                        
                        {/* Нижняя часть билета (QR) */}
                        <div className="glass-panel bg-secondary/30 border-border rounded-b-3xl p-6 flex items-center justify-between relative z-0">
                            <div className="flex flex-col gap-1">
                                <p className="label-text text-muted-foreground">Билет №</p>
                                <p className="font-mono text-lg font-bold tracking-widest">
                                    {ticket.id.slice(-6).toUpperCase()}
                                </p>
                                
                                <p className="label-text text-muted-foreground mt-3">Цена</p>
                                <p className="font-semibold text-lg">{ticket.totalPrice} ₽</p>
                            </div>
                            <div className="size-24 bg-white rounded-xl p-2 flex items-center justify-center relative group-hover:shadow-lg transition-all border border-border/40">
                                <QrCodeIcon className="size-16 text-black" />
                                <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Dialog for Ticket Details */}
            {selectedTicket && (
                <div 
                    className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
                    onClick={() => setSelectedTicket(null)}
                >
                    <div 
                        className="glass-panel max-w-md w-full bg-card rounded-3xl overflow-hidden relative shadow-2xl border border-border flex flex-col animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Image block inside Modal */}
                        <div className="relative w-full h-48">
                            <EventImage
                                src={selectedTicket.event.imageUrl}
                                alt={selectedTicket.event.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                            
                            {/* Close button */}
                            <button 
                                onClick={() => setSelectedTicket(null)}
                                className="absolute top-4 right-4 size-9 bg-background/80 hover:bg-background border border-border text-foreground hover:text-destructive rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Закрыть"
                            >
                                <XIcon className="size-5" />
                            </button>

                            <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {selectedTicket.event.genre}
                            </div>
                        </div>

                        {/* Modal Ticket Body */}
                        <div className="p-6 flex flex-col gap-4">
                            {showRefundForm ? (
                                <RefundForm
                                    ticketId={selectedTicket.id}
                                    ticketPrice={selectedTicket.totalPrice}
                                    onSubmitSuccess={() => {
                                        setShowRefundForm(false)
                                        setSelectedTicket(null)
                                        router.refresh()
                                    }}
                                    onCancel={() => setShowRefundForm(false)}
                                />
                            ) : (
                                <>
                                    <h2 className="text-2xl font-heading font-bold text-foreground leading-tight">
                                        {selectedTicket.event.title}
                                    </h2>

                                    <div className="flex flex-col gap-3 text-sm border-b border-border/40 pb-4">
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon className="size-4.5 text-primary" />
                                            <span className="font-semibold text-foreground">
                                                {format(new Date(selectedTicket.event.date), "d MMMM yyyy, HH:mm", { locale: ru })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPinIcon className="size-4.5 text-accent" />
                                            <span className="font-semibold text-foreground">
                                                {selectedTicket.event.location || 'Место проведения уточняется'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Perforation element */}
                                    <div className="relative border-t-2 border-dashed border-border/80 my-2">
                                        <div className="absolute -left-10 -top-3.5 size-7 rounded-full bg-background border border-border/50"></div>
                                        <div className="absolute -right-10 -top-3.5 size-7 rounded-full bg-background border border-border/50"></div>
                                    </div>

                                    {/* Bottom Ticket segment - QR code and check-in info */}
                                    <div className="flex flex-col items-center text-center gap-4 pt-2">
                                        <div className="relative p-4 bg-white rounded-2xl shadow-md border border-border flex items-center justify-center">
                                            {selectedTicket.status === 'CANCELLED' ? (
                                                <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4">
                                                    <span className="text-destructive font-bold uppercase tracking-wider border border-destructive/30 px-3 py-1 rounded-lg">
                                                        Аннулирован
                                                    </span>
                                                </div>
                                            ) : null}
                                            <QrCodeIcon className="size-40 text-black opacity-95" />
                                            {selectedTicket.status !== 'CANCELLED' && (
                                                <div className="absolute -inset-1.5 border-2 border-primary/40 rounded-[22px] animate-pulse"></div>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Уникальный код билета</p>
                                            <p className="font-mono text-lg font-bold tracking-widest text-foreground">
                                                {selectedTicket.id.toUpperCase()}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 w-full gap-4 bg-secondary/30 rounded-2xl p-4 border border-border/40">
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold">Количество</p>
                                                <p className="text-lg font-bold text-foreground">{selectedTicket.quantity} шт.</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold">Итоговая стоимость</p>
                                                <p className="text-lg font-bold text-primary">{selectedTicket.totalPrice} ₽</p>
                                            </div>
                                        </div>

                                        {selectedTicket.status === 'CANCELLED' ? (
                                            <p className="text-sm text-muted-foreground font-semibold">
                                                Билет возвращен
                                            </p>
                                        ) : selectedTicket.refundRequest?.status === 'PENDING' ? (
                                            <div className="bg-amber-500/10 border border-amber-500/25 px-4 py-2 rounded-xl text-amber-600 text-sm font-semibold">
                                                Запрос на возврат на рассмотрении
                                            </div>
                                        ) : selectedTicket.refundRequest?.status === 'REJECTED' ? (
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="bg-destructive/10 border border-destructive/25 px-4 py-2 rounded-xl text-destructive text-sm font-semibold">
                                                    В возврате отказано модератором
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 w-full">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowRefundForm(true)}
                                                    className="w-full h-11 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/15 transition-all text-sm font-semibold cursor-pointer"
                                                >
                                                    Вернуть билет
                                                </button>
                                                <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                                                    Пожалуйста, предъявите этот QR-код на входе. Считывание кода подтверждает право на проход.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
