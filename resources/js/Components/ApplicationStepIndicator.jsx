export default function ApplicationStepIndicator({ currentStatus }) {
    // 1. 正規のステップ一覧
    const steps = [
        "新規申請",
        "担当確認",
        "社内確認",
        "申請手続き",
        "申請済み",
    ];

    // 2. 現在のステータス文字列からインデックスを計算
    const getCurrentIndex = (status) => {
        if (status === "要修正") {
            return 0;
        }
        const index = steps.indexOf(status);
        return index !== -1 ? index : 0;
    };

    const currentIndex = getCurrentIndex(currentStatus);
    const isRevision = currentStatus === "要修正";

    return (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 my-4 overflow-x-auto">
            {/* ヘルパーメッセージ（要修正のときだけ目立たせる） */}
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-600">
                    進捗状況
                </span>
                {isRevision && (
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold animate-pulse">
                        ⚠ 修正が必要です
                    </span>
                )}
            </div>

            {/* ステップバー本体（スマホでも窮屈にならないよう微調整） */}
            <div className="flex items-center justify-between w-full min-w-[280px]">
                {steps.map((stepName, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div
                            key={stepName}
                            className="flex-1 flex items-center last:flex-initial"
                        >
                            {/* 丸とテキストのブロック */}
                            <div className="flex flex-col items-center">
                                {/* 数字をなくしたミニマムな丸 */}
                                <div
                                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all ${
                                        isCompleted
                                            ? "bg-blue-600"
                                            : isCurrent
                                              ? "bg-blue-600 ring-4 ring-blue-100"
                                              : "bg-gray-200"
                                    }`}
                                />
                                <span
                                    className={`text-[10px] sm:text-[11px] mt-1 text-center whitespace-nowrap ${
                                        isCurrent
                                            ? "font-bold text-blue-700"
                                            : isCompleted
                                              ? "text-gray-700 font-medium"
                                              : "text-gray-400"
                                    }`}
                                >
                                    {stepName}
                                </span>
                            </div>

                            {/* 間のバー */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all ${
                                        index < currentIndex
                                            ? "bg-blue-600"
                                            : "bg-gray-200"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
