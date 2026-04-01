'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sun, Zap, Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            // Store token and user info in localStorage for API calls and UI use
            if (data.token) {
                localStorage.setItem('admin_token', data.token);
            }
            if (data.user) {
                localStorage.setItem('admin_user', JSON.stringify(data.user));
            }
            router.push('/admin/dashboard');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute right-1/3 bottom-1/3 h-[300px] w-[300px] rounded-full bg-chart-2/5 blur-[100px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <Sun className="h-7 w-7 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        <span className="text-gradient">Pak</span>SolarTech
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm">
                    <div className="mb-5 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <h2 className="text-lg font-semibold">Sign In</h2>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full gap-2 glow" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
