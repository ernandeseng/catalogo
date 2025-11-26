"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import Header from "./components/Header";
import CategoryRail from "./components/CategoryRail";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import QuickViewModal from "./components/QuickViewModal";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";

type Category = {
    id: number;
    name: string;
};

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

interface CatalogClientProps {
    initialCategories: Category[];
    initialProducts: Product[];
}

export default function CatalogClient({ initialCategories, initialProducts }: CatalogClientProps) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [cartItems, setCartItems] = useState<{ id: number; name: string; price: number; corCodigo?: string; quantity: number }[]>([]);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Cart Drawer & Toast State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toast, setToast] = useState({ message: "", isVisible: false });

    // Calculate product counts per category
    const productCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        initialProducts.forEach(p => {
            counts[p.category_name] = (counts[p.category_name] || 0) + 1;
        });
        return counts;
    }, [initialProducts]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const matchesCategory = selectedCategory === "Todos" || product.category_name === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.corCodigo && product.corCodigo.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [initialProducts, selectedCategory, searchTerm]);

    const handleAdminAccess = () => {
        const password = window.prompt("Digite a senha de administrador:");
        if (password === "multkits77") {
            router.push("/admin");
        } else if (password) {
            alert("Senha incorreta!");
        }
    };

    const handleAddToQuote = (product: Product, quantity: number = 1) => {
        setCartItems(prev => {
            const existingItemIndex = prev.findIndex(item =>
                item.id === product.id && item.corCodigo === product.corCodigo
            );

            if (existingItemIndex > -1) {
                const newItems = [...prev];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                return [...prev, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    corCodigo: product.corCodigo,
                    quantity: quantity
                }];
            }
        });

        // Show Toast
        setToast({
            message: `${product.name} adicionado ao carrinho! (Qtd: ${quantity})`,
            isVisible: true
        });
    };

    const handleRemoveFromCart = (id: number, corCodigo?: string) => {
        setCartItems(prev => prev.filter(item => !(item.id === id && item.corCodigo === corCodigo)));
    };

    const handleQuickView = (product: Product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <Header
                    onSearch={setSearchTerm}
                    onAdminAccess={handleAdminAccess}
                    cartItems={cartItems}
                    onCartClick={() => setIsCartOpen(true)}
                />

                {/* Category Rail */}
                <div className="border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <CategoryRail
                            categories={initialCategories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            productCounts={productCounts}
                        />
                    </div>
                </div>
            </div>

            <main className="flex-grow">

                {/* Products Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {selectedCategory === "Todos" ? "Todos os Produtos" : selectedCategory}
                        </h2>
                        <span className="text-gray-500 text-sm">
                            {filteredProducts.length} produtos encontrados
                        </span>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToQuote={handleAddToQuote}
                                    onQuickView={handleQuickView}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="bg-gray-100 p-6 rounded-full mb-4">
                                <ArrowUp className="text-gray-400 rotate-180" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                            <p className="text-gray-500 max-w-md">
                                Tente ajustar sua busca ou selecionar outra categoria para encontrar o que você precisa.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory("Todos");
                                    setSearchTerm("");
                                }}
                                className="mt-6 text-primary-DEFAULT font-medium hover:underline"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}
                </section>
            </main>

            <Footer />

            <QuickViewModal
                product={quickViewProduct}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                onAddToQuote={handleAddToQuote}
            />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onRemoveItem={handleRemoveFromCart}
            />

            <Toast
                message={toast.message}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-primary-DEFAULT transition-colors z-30 opacity-50 hover:opacity-100"
                title="Voltar ao topo"
            >
                <ArrowUp size={24} />
            </button>
        </div>
    );
}
