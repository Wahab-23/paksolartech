import db from '@/app/lib/db';

export async function createUser(data) {
  const [result] = await db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [data.name, data.email]
  );
  return result.insertId;
}

export async function getAllUsers() {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
}

export async function getUserById(id) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}

export async function updateUser(id, data) {
  await db.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [data.name, data.email, id]
  );
}

export async function deleteUser(id) {
  await db.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
}