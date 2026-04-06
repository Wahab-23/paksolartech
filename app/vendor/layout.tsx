import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.role !== "vendor") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <div className="flex-1 flex overflow-hidden">
                {/* Simple Sidebar */}
                <aside className="w-64 border-r bg-card/50 backdrop-blur-sm hidden md:block">
                    <nav className="p-4 space-y-2">
                        <a href="/vendor" className="block px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium italic">
                            Dashboard
                        </a>
                        <a href="/vendor/offers" className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                            My Offers
                        </a>
                        <a href="/vendor/products" className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                            Find Products
                        </a>
                        <a href="/vendor/orders" className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                            Orders
                        </a>
                        <a href="/vendor/settings" className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                            Settings
                        </a>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
