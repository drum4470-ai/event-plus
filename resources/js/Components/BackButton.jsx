import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();
    const canGoBack = window.history.length > 1; // 履歴が1つ以上ある場合に戻れる

    return (
        <button
            onClick={() => navigate(-1)} // -1を指定すると直前の履歴に戻ります
            disabled={!canGoBack}
            className="px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 font-medium"
        >
            {/* 矢印アイコンなどを入れるとそれっぽくなります */}
            <img src="/images/left.svg" alt="戻る" className="w-5 h-5" />
        </button>
    );
}
