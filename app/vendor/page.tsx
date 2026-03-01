import { getSession } from "@/lib/auth";
import { getVendorByUserId } from "@/app/models/vendor.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Zap, TrendingUp, Package } from "lucide-react";

export default async function VendorDashboard() {
    const session = await getSession();
    const vendor = await getVendorByUserId(session!.id);

    if (!vendor?.is_approved) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <Badge variant="outline" className="mb-4 border-yellow-500/30 text-yellow-500">
                    Pending Approval
                </Badge>
                <h1 className="text-3xl font-bold mb-4">Welcome, {vendor?.business_name}</h1>
                <p className="text-muted-foreground">
                    Your vendor account is currently under review by our team.
                    You will be notified once you are approved to list products and receive orders.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back to your vendor portal, {vendor.business_name}.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Zap className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. 0.00</div>
                        <p className="text-xs text-muted-foreground">From 0 orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
                        <Sun className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Across all categories</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-chart-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+0%</div>
                        <p className="text-xs text-muted-foreground">Compared to last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <Package className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Ready for shipment</p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for charts/recent activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground italic">
                            Sales chart will appear here as you receive orders.
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground italic">No recent activity found.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
