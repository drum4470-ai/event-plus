// resources/js/Layouts/AdminLayout.jsx
export default function AdminLayout({ title, children }) {
    return (
        <div className="min-h-screen bg-gray-100 p-4 pb-12">
            <header className="py-6 mb-4">
                <h1 className="text-xl font-bold text-center text-gray-800">{title}</h1>
            </header>
            <div className="max-w-md mx-auto">
                {children}
            </div>
        </div>
    );
}