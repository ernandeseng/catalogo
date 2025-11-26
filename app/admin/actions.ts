'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';

const PASSWORD = 'multkits77';

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password') as string;
    if (password === PASSWORD) {
        cookies().set('admin_session', 'true', { httpOnly: true, path: '/' });
        redirect('/admin/dashboard');
    } else {
        return { error: 'Senha incorreta' };
    }
}

export async function logout() {
    cookies().delete('admin_session');
    redirect('/admin');
}

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category_id = parseInt(formData.get('category_id') as string);
    const corCodigo = formData.get('corCodigo') as string;
    const image = formData.get('image') as File;

    let image_path = '';

    if (image && image.size > 0) {
        const blob = await put(image.name, image, {
            access: 'public',
        });
        image_path = blob.url;
    }

    await db.createProduct({
        name,
        description,
        price,
        category_id,
        image_path,
        corCodigo,
        stock: parseInt(formData.get('stock') as string) || 0
    });

    revalidatePath('/catalogo');
    revalidatePath('/admin/dashboard');
}

export async function updateProduct(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category_id = parseInt(formData.get('category_id') as string);
    const corCodigo = formData.get('corCodigo') as string;
    const image = formData.get('image') as File;

    let image_path = formData.get('current_image_path') as string;

    if (image && image.size > 0) {
        // Delete old image if it's a blob URL
        if (image_path && image_path.startsWith('http')) {
            try {
                await del(image_path);
            } catch (e) {
                console.error('Error deleting old image:', e);
            }
        }

        const blob = await put(image.name, image, {
            access: 'public',
        });
        image_path = blob.url;
    }

    await db.updateProduct(id, {
        name,
        description,
        price,
        category_id,
        image_path,
        corCodigo,
        stock: parseInt(formData.get('stock') as string) || 0
    });

    revalidatePath('/catalogo');
    revalidatePath('/admin/dashboard');
}

export async function deleteProduct(id: number, image_path: string) {
    if (image_path && image_path.startsWith('http')) {
        try {
            await del(image_path);
        } catch (e) {
            console.error('Error deleting image:', e);
        }
    }

    await db.deleteProduct(id);
    revalidatePath('/catalogo');
    revalidatePath('/admin/dashboard');
}

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    try {
        await db.createCategory(name);
        revalidatePath('/catalogo');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function updateCategory(formData: FormData) {
    const id = parseInt(formData.get('id') as string);
    const name = formData.get('name') as string;
    try {
        await db.updateCategory(id, name);
        revalidatePath('/catalogo');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (e) {
        return { error: 'Erro ao atualizar categoria' };
    }
}

export async function deleteCategory(id: number) {
    try {
        await db.deleteCategory(id);
        revalidatePath('/catalogo');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

