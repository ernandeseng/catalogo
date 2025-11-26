"use client";

import { useState } from "react";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { clsx } from "clsx";

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
    stock?: number;
};

interface ProductCardProps {
    product: Product;
    onAddToQuote: (product: Product, quantity: number) => void;
    onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onAddToQuote, onQuickView }: ProductCardProps) {
    const [selectedVariation, setSelectedVariation] = useState(
        product.variations ? product.variations[0] : null
    );

    // Parse variations from corCodigo if no explicit variations exist
    const simpleVariations = !product.variations && product.corCodigo && product.corCodigo.includes('/')
        ? product.corCodigo.split('/').map(v => v.trim())
        : null;

    // Extract packaging info from description
    const packagingMatch = product.description.match(/Embalagem:.*$/);
    const packagingInfo = packagingMatch ? packagingMatch[0] : null;
    const cleanDescription = product.description.replace(/Embalagem:.*$/, '').trim();

    const currentPrice = selectedVariation ? selectedVariation.price : product.price;

    const [quantity, setQuantity] = useState(1);
    const stock = product.stock || 0;

    const handleIncrement = () => {
        if (quantity < stock) setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleAdd = () => {
        if (stock > 0) {
            onAddToQuote({ ...product, price: currentPrice, corCodigo: selectedVariation ? selectedVariation.name : product.corCodigo }, quantity);
            setQuantity(1);
        }
    };

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full relative">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {product.image_path ? (
                    <img
                        src={product.image_path}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                        <span className="text-sm">Sem imagem</span>
                    </div>
                )}

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                    {product.category_name}
                </span>

                {/* Stock Badge Removed as requested */}

                {/* Quick Actions Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-3">
                    <button
                        onClick={() => onQuickView(product)}
                        className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                    >
                        <Eye size={16} />
                        Ver Detalhes
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-1 group-hover:text-primary-DEFAULT transition-colors">
                        {product.name}
                    </h3>

                    {/* Variations Dropdown */}
                    {product.variations ? (
                        <div className="mb-2">
                            <select
                                className="w-full text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 outline-none focus:border-primary-DEFAULT bg-gray-50"
                                onChange={(e) => {
                                    const v = product.variations?.find(v => v.name === e.target.value);
                                    if (v) setSelectedVariation(v);
                                }}
                            >
                                {product.variations.map((v, i) => (
                                    <option key={i} value={v.name}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    ) : simpleVariations ? (
                        <div className="mb-2">
                            <select className="w-full text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 outline-none focus:border-primary-DEFAULT bg-gray-50">
                                {simpleVariations.map((v, i) => (
                                    <option key={i} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    ) : product.corCodigo && (
                        <p className="text-xs text-gray-500 font-mono mb-2">Ref: {product.corCodigo}</p>
                    )}
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-2 flex-grow">
                    {cleanDescription}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {packagingInfo && (
                        <p className="text-xs text-blue-400 font-medium bg-blue-50 inline-block px-2 py-1 rounded">
                            {packagingInfo}
                        </p>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Preço unitário</span>
                        <span className="text-xl font-bold text-[#FF6B35]">
                            {currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>

                    {stock > 0 ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                <button
                                    onClick={handleDecrement}
                                    className="px-3 py-2 text-gray-600 hover:text-primary-DEFAULT disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max={stock}
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val)) {
                                            if (val > stock) setQuantity(stock);
                                            else if (val < 1) setQuantity(1);
                                            else setQuantity(val);
                                        }
                                    }}
                                    className="w-12 text-center text-sm font-medium text-gray-900 bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                    onClick={handleIncrement}
                                    className="px-3 py-2 text-gray-600 hover:text-primary-DEFAULT disabled:opacity-50"
                                    disabled={quantity >= stock}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAdd}
                                className="flex-grow bg-gray-900 hover:bg-primary-DEFAULT text-white py-2 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                <ShoppingCart size={16} />
                                Adicionar
                            </button>
                        </div>
                    ) : (
                        <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                            Indisponível
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
