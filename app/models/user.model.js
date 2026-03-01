import db from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function createUser(data) {
  const hash = await bcrypt.hash(data.password, 12);
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
    [data.name, data.email, hash, data.role_id || 4] // Default to Customer (4)
  );
  return result.insertId;
}

export async function getAllUsers() {
  const [rows] = await db.query(`
    SELECT users.id, users.name, users.email, COALESCE(roles.name, 'customer') as role, users.is_active, users.created_at
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    ORDER BY users.created_at DESC
  `);
  return rows;
}

export async function getUserByEmail(email) {
  const [rows] = await db.query(`
    SELECT users.*, COALESCE(roles.name, 'customer') as role
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))
  `, [email]);
  return rows[0];
}

export async function getUserById(id) {
  const [rows] = await db.query(`
    SELECT users.id, users.name, users.email, COALESCE(roles.name, 'customer') as role, users.is_active, users.created_at
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    WHERE users.id = ?
  `, [id]);
  return rows[0];
}

export async function updateUser(id, data) {
  const updates = [];
  const values = [];

  if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
  if (data.email !== undefined) { updates.push('email = ?'); values.push(data.email); }
  if (data.role_id !== undefined) { updates.push('role_id = ?'); values.push(data.role_id); }
  if (data.is_active !== undefined) { updates.push('is_active = ?'); values.push(data.is_active); }

  if (updates.length === 0) return;

  values.push(id);
  await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
}

export async function deleteUser(id) {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
}

export async function authenticateUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return null;
  }
  const { password_hash, ...safeUser } = user;
  return safeUser;
}