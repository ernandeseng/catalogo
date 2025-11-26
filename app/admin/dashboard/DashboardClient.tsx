"use client";

import { useState } from "react";
import { LogOut, Plus, Pencil, Trash2, X, Image as ImageIcon, Copy, Check } from "lucide-react";
import { logout, createProduct, updateProduct, deleteProduct, createCategory, updateCategory, deleteCategory } from "../actions";
import Image from "next/image";

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
    stock?: number;
};

export default function DashboardClient({ initialCategories, initialProducts }: { initialCategories: Category[], initialProducts: Product[] }) {
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [copiedLink, setCopiedLink] = useState(false);

    const copyLink = () => {
        const url = `${window.location.origin}/catalogo`;
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsCategoryModalOpen(true);
    };

    const closeProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(false);
    };

    const closeCategoryModal = () => {
        setEditingCategory(null);
        setIsCategoryModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors"
                        >
                            {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                            {copiedLink ? 'Link Copiado!' : 'Copiar Link do Catálogo'}
                        </button>
                        <form action={logout}>
                            <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors">
                                <LogOut size={16} />
                                Sair
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'products'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Produtos
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'categories'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Categorias
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'products' ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Gerenciar Produtos</h2>
                            <button
                                onClick={() => setIsProductModalOpen(true)}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Plus size={18} />
                                Novo Produto
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4">Imagem</th>
                                            <th className="px-6 py-4">Nome</th>
                                            <th className="px-6 py-4">Cor / Código</th>
                                            <th className="px-6 py-4">Categoria</th>
                                            <th className="px-6 py-4">Estoque</th>
                                            <th className="px-6 py-4">Preço</th>
                                            <th className="px-6 py-4 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {initialProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                                                        {product.image_path ? (
                                                            <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                                <ImageIcon size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{product.corCodigo || '-'}</td>
                                                <td className="px-6 py-4 text-gray-600">{product.category_name}</td>
                                                <td className="px-6 py-4 text-gray-600">{product.stock || 0}</td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditProduct(product)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('Tem certeza que deseja excluir este produto?')) {
                                                                    await deleteProduct(product.id, product.image_path);
                                                                }
                                                            }}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {initialProducts.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                    Nenhum produto cadastrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Gerenciar Categorias</h2>
                            <button
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Plus size={18} />
                                Nova Categoria
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {initialCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditCategory(category)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Tem certeza que deseja excluir esta categoria?')) {
                                                                const res = await deleteCategory(category.id);
                                                                if (res?.error) alert(res.error);
                                                            }
                                                        }}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                            </h3>
                            <button onClick={closeProductModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            action={async (formData) => {
                                if (editingProduct) {
                                    await updateProduct(formData);
                                } else {
                                    await createProduct(formData);
                                }
                                closeProductModal();
                            }}
                            className="p-6 space-y-6"
                        >
                            {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}
                            {editingProduct && <input type="hidden" name="current_image_path" value={editingProduct.image_path || ''} />}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editingProduct?.name}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        defaultValue={editingProduct?.price}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estoque</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        defaultValue={editingProduct?.stock || 0}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                                    <select
                                        name="category_id"
                                        defaultValue={editingProduct?.category_id}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    >
                                        <option value="">Selecione...</option>
                                        {initialCategories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cor / Código</label>
                                <input
                                    type="text"
                                    name="corCodigo"
                                    defaultValue={editingProduct?.corCodigo}
                                    placeholder="Ex: Branco / 1234"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    defaultValue={editingProduct?.description}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <ImageIcon size={32} />
                                        <span className="text-sm">Clique para fazer upload ou arraste uma imagem</span>
                                        {editingProduct?.image_path && (
                                            <span className="text-xs text-green-600 mt-2">Imagem atual: {editingProduct.image_path.split('/').pop()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeProductModal}
                                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                                >
                                    Salvar Produto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                            </h3>
                            <button onClick={closeCategoryModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            action={async (formData) => {
                                if (editingCategory) {
                                    await updateCategory(formData);
                                } else {
                                    await createCategory(formData);
                                }
                                closeCategoryModal();
                            }}
                            className="p-6 space-y-6"
                        >
                            {editingCategory && <input type="hidden" name="id" value={editingCategory.id} />}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Categoria</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editingCategory?.name}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeCategoryModal}
                                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
