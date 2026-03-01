'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, X, Pencil, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

const ALL_ROLES = ['super_admin', 'admin', 'vendor', 'customer'];

const roleColors: Record<string, string> = {
    super_admin: 'bg-red-500/10 text-red-400',
    admin: 'bg-orange-500/10 text-orange-400',
    vendor: 'bg-purple-500/10 text-purple-400',
    customer: 'bg-blue-500/10 text-blue-400',
};

const roleToId: Record<string, number> = {
    super_admin: 1,
    admin: 2,
    vendor: 3,
    customer: 4,
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Create form state
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [createError, setCreateError] = useState('');
    const [creating, setSaving] = useState(false);

    // Edit state
    const [editUser, setEditUser] = useState<User | null>(null);
    const [editRole, setEditRole] = useState('');
    const [editSaving, setEditSaving] = useState(false);

    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/users')
            .then(r => r.json())
            .then(data => { setUsers(Array.isArray(data) ? data : []); })
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setCreateError('');
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: createForm.name,
                    email: createForm.email,
                    password: createForm.password,
                    role_id: roleToId[createForm.role] || 4,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setCreateError(data.error || 'Failed to create user'); return; }
            setShowCreate(false);
            setCreateForm({ name: '', email: '', password: '', role: 'customer' });
            fetchUsers();
        } catch {
            setCreateError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleEditSave = async () => {
        if (!editUser) return;
        setEditSaving(true);
        await fetch(`/api/users/${editUser.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role_id: roleToId[editRole] }),
        });
        setEditUser(null);
        setEditSaving(false);
        fetchUsers();
    };

    const handleToggleActive = async (id: number, isActive: boolean) => {
        await fetch(`/api/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: !isActive }),
        });
        setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !isActive } : u));
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Manage all platform users and their roles.</p>
                </div>
                <Button onClick={() => { setShowCreate(true); setCreateError(''); }} className="gap-2">
                    <Plus className="h-4 w-4" /> Add User
                </Button>
            </div>

            {/* Create User Form */}
            {showCreate && (
                <div className="mb-6 rounded-xl border border-border/50 bg-card/80 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold">Create New User</h2>
                        <button onClick={() => setShowCreate(false)}>
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                    </div>
                    {createError && <div className="mb-3 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{createError}</div>}
                    <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Full Name</Label>
                            <Input
                                value={createForm.name}
                                onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email Address</Label>
                            <Input
                                type="email"
                                value={createForm.email}
                                onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={createForm.password}
                                onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                                placeholder="Min 8 characters"
                                minLength={8}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Role</Label>
                            <select
                                value={createForm.role}
                                onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                                className="h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {ALL_ROLES.map(r => (
                                    <option key={r} value={r}>{r.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2 flex gap-3">
                            <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create User'}</Button>
                            <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Role Modal */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-border/50 bg-card p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold">Edit User Role</h2>
                            <button onClick={() => setEditUser(null)}>
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm font-medium">{editUser.name}</p>
                            <p className="text-xs text-muted-foreground">{editUser.email}</p>
                        </div>
                        <div className="mb-6 grid gap-2">
                            <Label>Role</Label>
                            <select
                                value={editRole}
                                onChange={e => setEditRole(e.target.value)}
                                className="h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                {ALL_ROLES.map(r => (
                                    <option key={r} value={r}>{r.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleEditSave} disabled={editSaving} className="flex-1">
                                {editSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Role Legend */}
            <div className="mb-4 flex flex-wrap gap-2">
                {ALL_ROLES.map(role => (
                    <span key={role} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${roleColors[role]}`}>
                        {role.replace('_', ' ')}
                    </span>
                ))}
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-xl border border-border/50 bg-card/50 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border/50 bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[user.role] || 'bg-muted text-muted-foreground'}`}>
                                            {user.role?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setEditUser(user); setEditRole(user.role); }}
                                                className="inline-flex items-center gap-1 text-xs rounded-lg px-3 py-1.5 bg-muted hover:bg-muted/80 transition-colors"
                                            >
                                                <Pencil className="h-3 w-3" /> Role
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(user.id, user.is_active)}
                                                className={`text-xs rounded-lg px-3 py-1.5 transition-colors ${user.is_active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
                                            >
                                                {user.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
