export default function PaginationWrapper({
    children,
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (totalPages <= 1) return <>{children}</>; // 1ページしかない場合はそのまま表示

    return (
        <div className="space-y-6">
            {/* 子要素（ご提示いただいたグリッドカード一覧） */}
            {children}

            {/* ページネーションのコントロールUI */}
            <div className="flex items-center justify-center gap-4 py-4">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    前へ
                </button>

                <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">{currentPage}</strong> /{" "}
                    {totalPages} ページ
                </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    次へ
                </button>
            </div>
        </div>
    );
}
