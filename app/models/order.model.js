import db from '@/app/lib/db';

export async function createOrder(data) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Create main order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)',
            [data.customer_id, data.total_amount, 'pending']
        );
        const orderId = orderResult.insertId;

        // 2. Create order items and split by vendor
        for (const item of data.items) {
            // Get offer and vendor details to calculate commission
            const [offerRows] = await connection.query(
                'SELECT offers.*, vendors.commission_rate FROM offers JOIN vendors ON offers.vendor_id = vendors.id WHERE offers.id = ?',
                [item.offer_id]
            );
            const offer = offerRows[0];

            if (!offer || offer.stock < item.quantity) {
                throw new Error(`Insufficient stock for offer ${item.offer_id}`);
            }

            const commissionAmount = (item.price * item.quantity) * (offer.commission_rate / 100);

            await connection.query(
                'INSERT INTO order_items (order_id, offer_id, vendor_id, price_at_purchase, quantity, commission_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [orderId, item.offer_id, offer.vendor_id, item.price, item.quantity, commissionAmount, 'pending']
            );

            // 3. Update Stock
            await connection.query(
                'UPDATE offers SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.offer_id]
            );
        }

        await connection.commit();
        return orderId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function getOrderById(id) {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    const order = rows[0];
    if (!order) return null;

    const [items] = await db.query(`
    SELECT order_items.*, products.name as product_name, products.image_url, vendors.business_name 
    FROM order_items 
    JOIN offers ON order_items.offer_id = offers.id 
    JOIN products ON offers.product_id = products.id 
    JOIN vendors ON order_items.vendor_id = vendors.id 
    WHERE order_items.order_id = ?
  `, [id]);

    return { ...order, items };
}

export async function getOrdersByCustomerId(customerId) {
    const [rows] = await db.query('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [customerId]);
    return rows;
}

export async function getOrdersByVendorId(vendorId) {
    const [rows] = await db.query(`
    SELECT order_items.*, orders.created_at, orders.customer_id, products.name as product_name 
    FROM order_items 
    JOIN orders ON order_items.order_id = orders.id 
    JOIN offers ON order_items.offer_id = offers.id 
    JOIN products ON offers.product_id = products.id 
    WHERE order_items.vendor_id = ? 
    ORDER BY orders.created_at DESC
  `, [vendorId]);
    return rows;
}
