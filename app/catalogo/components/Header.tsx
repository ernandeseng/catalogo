"use client";

import { useState, useMemo } from "react";
import { Search, Menu, X, Phone, Instagram, Lock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

type CartItem = {
    id: number;
    name: string;
    price: number;
    corCodigo?: string;
    quantity: number;
};

interface HeaderProps {
    onSearch: (term: string) => void;
    onAdminAccess: () => void;
    cartItems: CartItem[];
    onCartClick: () => void;
}

export default function Header({ onSearch, onAdminAccess, cartItems, onCartClick }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const whatsappLink = useMemo(() => {
        const phoneNumber = "5571992344791";
        if (cartItems.length === 0) {
            return `https://wa.me/${phoneNumber}?text=Olá, gostaria de fazer um orçamento.`;
        }

        let message = "Olá, gostaria de fazer um orçamento para os seguintes itens:\n\n";
        cartItems.forEach(item => {
            message += `* ${item.quantity}x ${item.name}`;
            if (item.corCodigo) {
                message += ` (${item.corCodigo})`;
            }
            message += `\n`;
        });

        return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }, [cartItems]);

    return (
        <header className="bg-white pb-6 pt-4 relative">
            {/* Absolute Actions (Cart & Admin) */}
            <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
                <button
                    onClick={onAdminAccess}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Admin"
                >
                    <Lock size={20} />
                </button>
                <button
                    onClick={onCartClick}
                    className="relative p-2 text-gray-600 hover:text-primary-DEFAULT transition-colors bg-gray-50 rounded-full"
                >
                    <ShoppingCart size={24} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary-DEFAULT text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                {/* Logo */}
                <div className="mb-4">
                    <img
                        src="https://i.ibb.co/GqqGr2S/Design-sem-nome-8.png"
                        alt="Mult Kits Brasil"
                        className="h-24 md:h-32 w-auto object-contain"
                    />
                </div>

                {/* Company Name */}
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tight">
                    MULT KITS BRASIL
                </h1>

                {/* Address */}
                <a
                    href="https://goo.gl/maps/XYZ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 text-sm md:text-base mb-1 hover:text-primary-DEFAULT transition-colors"
                >
                    Rua Dr. Edgar de Barros 77, Salvador – BA
                </a>

                {/* Phone */}
                <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base mb-6">
                    <Phone size={16} />
                    <span>71 3011 7296</span>
                    <span className="mx-1">•</span>
                    <span>71 99234-4791</span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
                    <a
                        href="https://instagram.com/multkitsbr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                        <Instagram size={20} />
                        <span>Acesse nosso Instagram</span>
                    </a>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 invert brightness-0" />
                        <span>Chamar no WhatsApp</span>
                    </a>
                </div>

                {/* Search Bar (Optional placement) */}
                <div className="w-full max-w-md mt-6 relative">
                    <input
                        type="text"
                        placeholder="O que você procura?"
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-DEFAULT/20 outline-none transition-all bg-gray-50 focus:bg-white text-center sm:text-left"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>
        </header>
    );
}
