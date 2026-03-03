import { ButtonHTMLAttributes } from "react";

interface ButtonCompProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode,
    isFilled?: boolean,
    onClick?: () => void,
}
export function ButtonComp({children, onClick, type = 'button', disabled}:ButtonCompProps){
    return <button disabled={disabled} onClick={onClick} type={type} className="w-full h-14 bg-[#FF5100] rounded-2xl text-lg text-white cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 disabled:cursor-not-allowed">{children}</button>
}