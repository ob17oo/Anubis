import Image from "next/image";
import React from "react";

interface InputCompProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label: string,
    icon?: string
}

export function InputComp({label, icon, ...props}: InputCompProps){
    return (
        <div className="relative w-full h-full">
            <input className={`w-full py-3 text-lg rounded-2xl border-2 border-[#FF5100] outline-0 ${icon ? 'px-10' : 'px-3'}`} placeholder={label} {...props} />
            { icon && (
                <Image className="absolute inset-0 top-1/2 -translate-y-1/2 left-2" width={20} height={20} src={icon} alt={`Icon ${icon}`}/>
            ) }
        </div>
    )
}
