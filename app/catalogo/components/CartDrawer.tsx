"use client";

import { X, Trash2, ShoppingCart } from "lucide-react";
import { useMemo } from "react";

type CartItem = {
    id: number;
    name: string;
    price: number;
    corCodigo?: string;
    quantity: number;
    image_path?: string;
};

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemoveItem: (id: number, corCodigo?: string) => void;
}

export default function CartDrawer({ isOpen, onClose, items, onRemoveItem }: CartDrawerProps) {
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const whatsappLink = useMemo(() => {
        const phoneNumber = "5571992344791";
        if (items.length === 0) return "";

        let message = "Olá, gostaria de fazer um orçamento para os seguintes itens:\n\n";
        items.forEach(item => {
            message += `* ${item.quantity}x ${item.name}`;
            if (item.corCodigo) {
                message += ` (${item.corCodigo})`;
            }
            message += `\n`;
        });

        return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }, [items]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-900">
                        <ShoppingCart size={20} />
                        <h2 className="font-bold text-lg">Seu Carrinho</h2>
                        <span className="bg-primary-DEFAULT text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {items.reduce((acc, i) => acc + i.quantity, 0)}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-5 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <ShoppingCart size={48} className="opacity-20" />
                            <p>Seu carrinho está vazio</p>
                            <button
                                onClick={onClose}
                                className="text-primary-DEFAULT font-medium hover:underline"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={`${item.id}-${item.corCodigo || index}`} className="flex gap-4 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                {/* Image placeholder if needed, or just text */}
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</h3>
                                    {item.corCodigo && (
                                        <p className="text-xs text-gray-500 mt-1">Ref: {item.corCodigo}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                                            <span className="text-xs text-gray-500">Qtd:</span>
                                            <span className="font-semibold text-sm text-gray-900">{item.quantity}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary-DEFAULT text-sm">
                                                {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRemoveItem(item.id, item.corCodigo)}
                                    className="text-gray-400 hover:text-red-500 self-start p-1"
                                    title="Remover item"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">Total estimado</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/20 active:scale-[0.98]"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6 invert brightness-0" />
                            Finalizar no WhatsApp
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
