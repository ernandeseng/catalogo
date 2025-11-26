import { sql } from '@vercel/postgres';

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_path: string;
  corCodigo?: string;
  variations?: { name: string; price: number }[];
  stock?: number;
  category_name: string;
};

export const db = {
  init: async () => {
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        image_path TEXT,
        cor_codigo TEXT,
        stock INTEGER DEFAULT 0,
        variations JSONB
      );
    `;

    // Seed initial categories if empty
    const { rows } = await sql`SELECT count(*) as count FROM categories`;
    if (rows[0].count === '0') {
      const initialCategories = [
        'Tubos', 'Rolamentos', 'Rodízios', 'Tampas', 'Estacionamentos',
        'Saídas', 'Acabamentos', 'Fechaduras', 'Roldanas', 'Aparadores', 'Batentes'
      ];
      for (const name of initialCategories) {
        await sql`INSERT INTO categories (name) VALUES (${name})`;
      }
    }
  },

  getCategories: async (): Promise<Category[]> => {
    const { rows } = await sql<Category>`SELECT * FROM categories ORDER BY name ASC`;
    return rows;
  },

  getProducts: async (): Promise<Product[]> => {
    const { rows } = await sql`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `;
    return rows.map(row => ({
      ...row,
      price: Number(row.price),
      corCodigo: row.cor_codigo, // Map snake_case to camelCase
      variations: row.variations || undefined
    })) as Product[];
  },

  createProduct: async (product: Omit<Product, 'id' | 'category_name'>) => {
    const { name, description, price, category_id, image_path, corCodigo, variations, stock } = product;
    const { rows } = await sql`
      INSERT INTO products (name, description, price, category_id, image_path, cor_codigo, variations, stock)
      VALUES (${name}, ${description}, ${price}, ${category_id}, ${image_path}, ${corCodigo}, ${JSON.stringify(variations)}, ${stock})
      RETURNING *
    `;
    return rows[0];
  },

  updateProduct: async (id: number, updates: Partial<Product>) => {
    // Construct dynamic update query
    // Note: This is a bit simplified. For a robust solution, we might want to be more explicit.
    // However, since we know the fields, we can handle them.

    const current = await db.getProductById(id);
    if (!current) return false;

    const name = updates.name ?? current.name;
    const description = updates.description ?? current.description;
    const price = updates.price ?? current.price;
    const category_id = updates.category_id ?? current.category_id;
    const image_path = updates.image_path ?? current.image_path;
    const corCodigo = updates.corCodigo ?? current.corCodigo;
    const variations = updates.variations ?? current.variations;
    const stock = updates.stock ?? current.stock;

    await sql`
      UPDATE products 
      SET name = ${name}, description = ${description}, price = ${price}, 
          category_id = ${category_id}, image_path = ${image_path}, 
          cor_codigo = ${corCodigo}, variations = ${JSON.stringify(variations)}, stock = ${stock}
      WHERE id = ${id}
    `;
    return true;
  },

  getProductById: async (id: number): Promise<Product | null> => {
    const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      ...row,
      price: Number(row.price),
      corCodigo: row.cor_codigo,
      variations: row.variations || undefined
    } as Product;
  },

  deleteProduct: async (id: number) => {
    await sql`DELETE FROM products WHERE id = ${id}`;
  },

  clearProducts: async () => {
    await sql`DELETE FROM products`;
  },

  createCategory: async (name: string) => {
    try {
      await sql`INSERT INTO categories (name) VALUES (${name})`;
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Categoria já existe');
      }
      throw error;
    }
  },

  updateCategory: async (id: number, name: string) => {
    await sql`UPDATE categories SET name = ${name} WHERE id = ${id}`;
  },

  deleteCategory: async (id: number) => {
    // Check for products first
    const { rows } = await sql`SELECT count(*) as count FROM products WHERE category_id = ${id}`;
    if (rows[0].count > 0) {
      throw new Error('Não é possível excluir categoria com produtos vinculados');
    }
    await sql`DELETE FROM categories WHERE id = ${id}`;
  }
};

export default db;

