import db from "@/lib/db";
import CatalogClient from "./catalogo/CatalogClient";

export const dynamic = 'force-dynamic';

export default function Home() {
    const categories = db.getCategories();
    const products = db.getProducts();

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <CatalogClient initialCategories={categories} initialProducts={products} />
        </main>
    );
}
