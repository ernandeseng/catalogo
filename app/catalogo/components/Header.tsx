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
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Top Bar - Contact & Social */}
            <div className="bg-gray-900 text-white py-2 text-xs md:text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a href="https://goo.gl/maps/XYZ" target="_blank" rel="noopener noreferrer" className="hover:text-primary-DEFAULT transition-colors hidden sm:flex items-center gap-1">
                            <span>Rua Dr. Edgar de Barros 77, Salvador – BA</span>
                        </a>
                        <a href="tel:+557130117296" className="hover:text-primary-DEFAULT transition-colors flex items-center gap-1">
                            <Phone size={14} />
                            <span>71 3011 7296</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="https://instagram.com/multkitsbr" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors flex items-center gap-1">
                            <Instagram size={14} />
                            <span className="hidden sm:inline">Instagram</span>
                        </a>
                        <button onClick={onAdminAccess} className="hover:text-primary-DEFAULT transition-colors flex items-center gap-1">
                            <Lock size={14} />
                            <span className="hidden sm:inline">Admin</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img
                            src="https://i.ibb.co/GqqGr2S/Design-sem-nome-8.png"
                            alt="Mult Kits Brasil"
                            className="h-12 md:h-16 w-auto object-contain"
                        />
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-2xl relative">
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-DEFAULT/20 outline-none transition-all bg-gray-50 focus:bg-white"
                        />
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md font-medium"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 invert brightness-0" />
                            <span>Orçamento</span>
                        </a>

                        <button
                            onClick={onCartClick}
                            className="relative p-2 text-gray-600 hover:text-primary-DEFAULT transition-colors"
                        >
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary-DEFAULT text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-primary-DEFAULT"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search & Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 animate-in slide-in-from-top-2">
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                onChange={(e) => onSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-DEFAULT outline-none bg-gray-50"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg font-medium"
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 invert brightness-0" />
                                Fazer Orçamento
                            </a>
                            <button onClick={onAdminAccess} className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium">
                                <Lock size={18} />
                                Acesso Admin
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
