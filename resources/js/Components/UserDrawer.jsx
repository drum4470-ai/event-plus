
import { Link } from 'react-router-dom';

export default function UserDrawer({ isOpen, onClose }) {
    return (
        <div 
            className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            {/* 背景の黒いオーバーレイ（フェードイン・アウト） */}
            <div 
                className="fixed inset-0 bg-black/50" 
                onClick={onClose}
            />

            {/* スライドして出てくるドロワー本体 */}
            <div 
                className={`relative w-72 bg-white h-full shadow-2xl p-6 flex flex-col z-10 space-y-4 transform transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex justify-between items-center pb-4 border-b">
                    <h3 className="font-bold text-lg">メニュー</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold px-2"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-3 flex flex-col items-stretch">
                    <Link
                        to="/applications"
                        onClick={onClose}
                        className="block px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium"
                    >
                        新規利用申請を行う
                    </Link>
                    <Link
                        to="/applications/search"
                        onClick={onClose}
                        className="block px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium"
                    >
                        申請履歴を検索する
                    </Link>
                    <Link
                        to="/edit"
                        onClick={onClose}
                        className="block px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium"
                    >
                        プロフィールを編集する
                    </Link>
                </div>
            </div>
        </div>
    );
}