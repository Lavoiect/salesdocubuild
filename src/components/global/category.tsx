'use client'
import clsx from "clsx";
import { id } from "date-fns/locale";
import React from "react";

interface CategoryComponentProps {
    title: string,
    colorName: string
    selectedColor?: (color: string) => void
    selectedColorName?: string
}

const CategoryComponent: React.FC<CategoryComponentProps> = ({
    colorName,
    title,
    selectedColor,
    selectedColorName
}) => {

    const isSelected = colorName === selectedColorName;

    return (
        <div
            className={clsx('p-2 rounded-sm flex-shrink-0 text-xs cursor-pointer',{
                'bg-[#57acea]/10 text-[#57acea]': colorName === 'BLUE',
                'bg-[#ffac7e]/10 text-[#ffac7e]': colorName === 'ORANGE',
                'bg-rose-500/10 text-rose-500': colorName === 'ROSE',
                'bg-emerald-400/10 text-emerald-400': colorName === 'GREEN',
                'bg-purple-400/10 text-purple-400': colorName === 'PURPLE',
                
                'border-[1px] border-[#57acea]': colorName === 'BLUE' && !title,
                'border-[1px] border-[#ffac7e]': colorName === 'ORANGE' && !title,
                'border-[1px] border-rose-500': colorName === 'ROSE' && !title,
                'border-[1px] border-emerald-400': colorName === 'GREEN' && !title,
                'border-[1px] border-purple-400': colorName === 'PURPLE' && !title,
                'outline outline-offset-1 outline-2': isSelected,
            })}
            key={colorName}
            onClick={() => {
                if(selectedColor) selectedColor(colorName)
                
            }}
        >
            {title}
        </div>
    )
}

export default CategoryComponent
