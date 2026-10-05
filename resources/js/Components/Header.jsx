import BackButton from "@/Components/BackButton";
// import ForwardButton from "@/Components/ForwardButton";

export default function Header() {
    return (
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
            {/* 左側：ロゴ（クリックしたら管理者ダッシュボードへ） */}
            <div className="flex items-center">
                <img
                    src="/images/logo.svg"
                    alt="App Logo"
                    className="w-12 h-12"
                />
            </div>

            {/* 中央：タイトル */}
            <div className="flex justify-center">
                <span className="font-bold text-3xl text-gray-800">
                    EventPlus
                </span>
            </div>

            {/* 右側：ボタンや予備スペース */}
            <div className="flex justify-end">
                <span className="font-bold text-xl text-gray-800 flex gap-2">
                    <BackButton />
                    {/* <ForwardButton /> */}
                </span>
            </div>
        </header>
    );
}
