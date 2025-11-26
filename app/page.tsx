import db from "@/lib/db";
import CatalogClient from "./catalogo/CatalogClient";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const categories = await db.getCategories();
    const products = await db.getProducts();

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <CatalogClient initialCategories={categories} initialProducts={products} />
        </main>
    );
}
