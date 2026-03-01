import db from '@/app/lib/db';

async function safeQuery(query, params = []) {
    try {
        const [rows] = await db.query(query, params);
        return rows;
    } catch {
        return null;
    }
}

export async function logActivity(data) {
    try {
        const [result] = await db.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
            [data.user_id || null, data.action, data.entity_type || null, data.entity_id || null, JSON.stringify(data.details || {})]
        );
        return result.insertId;
    } catch { return null; }
}

export async function trackView(data) {
    try {
        const [result] = await db.query(
            'INSERT INTO views (entity_type, entity_id, viewer_id, ip_address) VALUES (?, ?, ?, ?)',
            [data.entity_type, data.entity_id || null, data.viewer_id || null, data.ip_address || null]
        );
        return result.insertId;
    } catch { return null; }
}

export async function getAdminStats() {
    const stats = {
        total_revenue: 0,
        total_users: 0,
        active_vendors: 0,
        total_orders: 0,
        total_views: 0,
    };

    const revenue = await safeQuery('SELECT SUM(total_amount) as total FROM orders WHERE status = "paid"');
    if (revenue) stats.total_revenue = revenue[0]?.total || 0;

    const userCount = await safeQuery('SELECT COUNT(*) as count FROM users');
    if (userCount) stats.total_users = userCount[0]?.count || 0;

    const vendorCount = await safeQuery('SELECT COUNT(*) as count FROM vendors WHERE is_approved = TRUE');
    if (vendorCount) stats.active_vendors = vendorCount[0]?.count || 0;

    const orderCount = await safeQuery('SELECT COUNT(*) as count FROM orders');
    if (orderCount) stats.total_orders = orderCount[0]?.count || 0;

    const viewCount = await safeQuery('SELECT COUNT(*) as count FROM views');
    if (viewCount) stats.total_views = viewCount[0]?.count || 0;

    return stats;
}

export async function getVendorStats(vendorId) {
    const stats = { total_orders: 0, total_revenue: 0, total_commission: 0, active_offers: 0 };

    const orderStats = await safeQuery(`
        SELECT COUNT(*) as count, SUM(price_at_purchase * quantity) as revenue, SUM(commission_amount) as commission 
        FROM order_items 
        WHERE vendor_id = ? AND status != "refunded"
    `, [vendorId]);

    if (orderStats) {
        stats.total_orders = orderStats[0]?.count || 0;
        stats.total_revenue = orderStats[0]?.revenue || 0;
        stats.total_commission = orderStats[0]?.commission || 0;
    }

    const offerCount = await safeQuery('SELECT COUNT(*) as count FROM offers WHERE vendor_id = ? AND is_active = TRUE', [vendorId]);
    if (offerCount) stats.active_offers = offerCount[0]?.count || 0;

    return stats;
}
