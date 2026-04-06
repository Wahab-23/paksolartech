import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}