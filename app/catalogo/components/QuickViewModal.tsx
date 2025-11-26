"use client";

import { X, ShoppingCart, Check } from "lucide-react";
import { useState, useEffect } from "react";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    category_id: number;
    category_name: string;
    image_path: string;
    corCodigo?: string;
    variations?: { name: string; price: number }[];
};

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToQuote: (product: Product) => void;
}

export default function QuickViewModal({ product, isOpen, onClose, onAddToQuote }: QuickViewModalProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState<{ name: string; price: number } | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setIsAdding(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (product && product.variations) {
            setSelectedVariation(product.variations[0]);
        } else {
            setSelectedVariation(null);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleAddToQuote = () => {
        setIsAdding(true);
        const productToAdd = {
            ...product,
            price: selectedVariation ? selectedVariation.price : product.price,
            corCodigo: selectedVariation ? selectedVariation.name : product.corCodigo
        };
        onAddToQuote(productToAdd);
        setTimeout(() => {
            setIsAdding(false);
            onClose();
        }, 800);
    };

    // Parse simple variations from corCodigo if no explicit variations exist
    const simpleVariations = !product.variations && product.corCodigo && product.corCodigo.includes('/')
        ? product.corCodigo.split('/').map(v => v.trim())
        : null;

    const currentPrice = selectedVariation ? selectedVariation.price : product.price;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X size={24} className="text-gray-500" />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center min-h-[300px]">
                    {product.image_path ? (
                        <img
                            src={product.image_path}
                            alt={product.name}
                            className="max-w-full max-h-[400px] object-contain drop-shadow-xl"
                        />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <span className="text-lg">Sem imagem</span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary-dark text-xs font-semibold rounded-full mb-3">
                            {product.category_name}
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>

                        {/* Variations Dropdown */}
                        {product.variations ? (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a variação:</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-primary/50"
                                    onChange={(e) => {
                                        const v = product.variations?.find(v => v.name === e.target.value);
                                        if (v) setSelectedVariation(v);
                                    }}
                                    value={selectedVariation?.name}
                                >
                                    {product.variations.map((v, i) => (
                                        <option key={i} value={v.name}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                        ) : simpleVariations ? (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Opções:</label>
                                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-primary/50">
                                    {simpleVariations.map((v, i) => (
                                        <option key={i} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        ) : product.corCodigo && (
                            <p className="text-sm text-gray-500 font-mono">Ref: {product.corCodigo}</p>
                        )}
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-8 flex-grow overflow-y-auto max-h-[200px]">
                        <p>{product.description}</p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Preço unitário</p>
                                <p className="text-3xl font-bold text-[#FF6B35]">
                                    {currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToQuote}
                            disabled={isAdding}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${isAdding
                                    ? "bg-green-500 text-white scale-[0.98]"
                                    : "bg-gray-900 hover:bg-primary-DEFAULT text-white hover:shadow-lg hover:-translate-y-1"
                                }`}
                        >
                            {isAdding ? (
                                <>
                                    <Check size={24} />
                                    Adicionado!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={24} />
                                    Adicionar ao Orçamento
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
