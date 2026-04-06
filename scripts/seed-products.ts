import mysql from 'mysql2/promise';
import { categories, products } from '../lib/dummyProducts';

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'pakuser',
        password: process.env.DB_PASSWORD || 'paksecret',
        database: process.env.DB_NAME || 'paksolar'
    });

    console.log("Connected to DB. Starting seed process...");

    try {
        // Insert Categories
        for (const cat of categories) {
            await connection.execute(`
                INSERT INTO categories (id, name, slug, description, icon) 
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    name=VALUES(name), 
                    description=VALUES(description), 
                    icon=VALUES(icon)
            `, [cat.id, cat.name, cat.slug, cat.description, cat.icon]);
        }
        console.log("Categories seeded successfully.");

        // Insert Products
        for (const prod of products) {
            await connection.execute(`
                INSERT INTO products (
                    id, name, slug, description, short_desc, category_id, 
                    image_url, status, badge, price_from, price_to, 
                    is_featured, wattage, brand, specs
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    name=VALUES(name), 
                    description=VALUES(description), 
                    short_desc=VALUES(short_desc),
                    image_url=VALUES(image_url), 
                    status=VALUES(status), 
                    badge=VALUES(badge),
                    price_from=VALUES(price_from), 
                    price_to=VALUES(price_to), 
                    is_featured=VALUES(is_featured),
                    wattage=VALUES(wattage), 
                    brand=VALUES(brand), 
                    specs=VALUES(specs)
            `, [
                prod.id, 
                prod.name, 
                prod.slug, 
                prod.description, 
                prod.shortDesc || '', 
                prod.category_id,
                prod.image_url, 
                prod.status, 
                prod.badge || null, 
                prod.price_from, 
                prod.price_to || null,
                prod.is_featured ? 1 : 0, 
                prod.wattage || null, 
                prod.brand, 
                JSON.stringify(prod.specs)
            ]);
        }
        console.log("Products seeded successfully.");

    } catch (e) {
        console.error("Error during seeding process:", e);
    } finally {
        await connection.end();
        console.log("Database connection closed.");
    }
}

seed();
