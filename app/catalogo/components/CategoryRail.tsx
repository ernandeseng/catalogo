"use client";

import {
    CircleDot, Settings, Disc, Circle, Car, DoorOpen,
    Brush, Key, CircleDashed, Square, StopCircle, LayoutGrid
} from "lucide-react";
import { clsx } from "clsx";

type Category = {
    id: number;
    name: string;
};

interface CategoryRailProps {
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    productCounts?: Record<string, number>;
}

const iconMap: Record<string, any> = {
    "Tubos": CircleDot,
    "Rolamentos": Settings,
    "Rodízios": Disc,
    "Tampas": Circle,
    "Estacionamentos": Car,
    "Saídas": DoorOpen,
    "Acabamentos": Brush,
    "Fechaduras": Key,
    "Roldanas": CircleDashed,
    "Aparadores": Square,
    "Batentes": StopCircle,
};

export default function CategoryRail({ categories, selectedCategory, onSelectCategory, productCounts }: CategoryRailProps) {
    return (
        <div className="w-full overflow-x-auto pb-6 pt-2 scrollbar-hide">
            <div className="flex gap-4 px-4 min-w-max">
                <button
                    onClick={() => onSelectCategory("Todos")}
                    className={clsx(
                        "group flex flex-col items-center gap-3 min-w-[100px] p-4 rounded-xl transition-all duration-300 border",
                        selectedCategory === "Todos"
                            ? "bg-primary-DEFAULT/10 border-primary-DEFAULT text-primary-DEFAULT shadow-md scale-105"
                            : "bg-white border-gray-100 text-gray-500 hover:border-primary-DEFAULT/50 hover:text-primary-DEFAULT hover:shadow-sm"
                    )}
                >
                    <div className={clsx(
                        "p-3 rounded-full transition-colors",
                        selectedCategory === "Todos" ? "bg-primary-DEFAULT text-white" : "bg-gray-50 group-hover:bg-primary-DEFAULT/10"
                    )}>
                        <LayoutGrid size={24} />
                    </div>
                    <span className="font-medium text-sm">Todos</span>
                </button>

                {categories.map((cat) => {
                    const Icon = iconMap[cat.name] || Circle;
                    const count = productCounts?.[cat.name] || 0;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.name)}
                            className={clsx(
                                "group flex flex-col items-center gap-3 min-w-[100px] p-4 rounded-xl transition-all duration-300 border",
                                selectedCategory === cat.name
                                    ? "bg-primary-DEFAULT/10 border-primary-DEFAULT text-primary-DEFAULT shadow-md scale-105"
                                    : "bg-white border-gray-100 text-gray-500 hover:border-primary-DEFAULT/50 hover:text-primary-DEFAULT hover:shadow-sm"
                            )}
                        >
                            <div className={clsx(
                                "p-3 rounded-full transition-colors",
                                selectedCategory === cat.name ? "bg-primary-DEFAULT text-white" : "bg-gray-50 group-hover:bg-primary-DEFAULT/10"
                            )}>
                                <Icon size={24} />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-medium text-sm whitespace-nowrap">{cat.name}</span>
                                <span className="text-[10px] text-gray-400">{count} itens</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
