import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export default function BasicLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 共通のヘッダー */}
            <Header />

            {/* 各ページの中身がここに差し込まれる */}
            <main className="flex-1">{children}</main>

            {/* 共通のフッダー */}
            <Footer />
        </div>
    );
}
