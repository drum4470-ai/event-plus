import { useNavigate } from "react-router-dom";

export default function ForwardButton() {
    const navigate = useNavigate();
    const canNotGoForward = window.history.length > 0;

    return (
        <button
            onClick={() => navigate(1)}
            disabled={canNotGoForward}
            className="px-2 py-2 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 font-medium"
            title="進む"
        >
            <img src="/images/right.svg" alt="進む" className="w-5 h-5" />
        </button>
    );
}
