import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'paksolar-fallback-secret-change-me';

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export function getTokenFromRequest(request) {
    // Check Authorization header first
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    // Fallback to cookie
    const cookie = request.headers.get('cookie');
    if (cookie) {
        // Try new marketplace token first
        const paksolarMatch = cookie.match(/paksolar_token=([^;]+)/);
        if (paksolarMatch) return paksolarMatch[1];

        // Fallback to old token name
        const match = cookie.match(/token=([^;]+)/);
        if (match) return match[1];
    }

    return null;
}

export function requireAuth(request) {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token);
}
