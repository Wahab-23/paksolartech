import db from '@/app/lib/db';

export async function createUser(data) {
  const [result] = await db.query(
    'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
    [data.name, data.email, data.age]
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
  const updates = [];
  const values = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.email !== undefined) {
    updates.push('email = ?');
    values.push(data.email);
  }
  if (data.age !== undefined) {
    updates.push('age = ?');
    values.push(data.age);
  }

  if (updates.length === 0) return;

  values.push(id);
  await db.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteUser(id) {
  await db.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
}