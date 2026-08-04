import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import RouteProgress from "@/components/public/RouteProgress";
import { Suspense } from "react";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense fallback={null}>
                <RouteProgress />
            </Suspense>
            <Header />
            {children}
            <Footer />
        </>
    );
}