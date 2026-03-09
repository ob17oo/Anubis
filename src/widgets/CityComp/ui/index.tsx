interface CityPopUpProps {
    isOpen: boolean,
    onClose: () => void
}
export function CityDialogComp({isOpen, onClose}:CityPopUpProps){
    if(!isOpen) return null

    return (
        <section className="w-full h-screen fixed inset-0 z-20 bg-black/30" onClick={onClose}>
            <div className="w-full h-full flex items-center justify-center">
                <div onClick={(e) => e.stopPropagation()} className="rounded-2xl w-80 h-80 bg-gray-100"></div>
            </div>
        </section>
    )
}