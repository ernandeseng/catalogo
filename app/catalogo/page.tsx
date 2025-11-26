import db from "@/lib/db";
import CatalogClient from "./CatalogClient";

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
    const categories = await db.getCategories();
    const products = await db.getProducts();

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <CatalogClient initialCategories={categories} initialProducts={products} />
        </main>
    );
}
