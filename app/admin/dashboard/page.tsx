import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const cookieStore = cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    if (!isAdmin) {
        redirect('/admin');
    }

    const categories = await db.getCategories();
    const products = await db.getProducts();
    // Sort by newest (assuming id is serial and increasing)
    const sortedProducts = products.sort((a, b) => b.id - a.id);

    return (
        <main className="min-h-screen bg-gray-50">
            <DashboardClient initialCategories={categories} initialProducts={sortedProducts} />
        </main>
    );
}
