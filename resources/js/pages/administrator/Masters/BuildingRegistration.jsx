import React, { useState } from "react";
import api from "@/api";
import CommonModal from "@/Components/CommonModal";
import { calculateSimilarity } from "@/Utils/levenshtein";
import PaginationWrapper from "@/Layouts/PaginationWrapper"; // ★ 追加

export default function BuildingRegistration({
    existingNames = [],
    onUpdate = () => {},
}) {
    console.log(existingNames);

    // ページネーション用State管理
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 1ページあたりのアイテム数

    const totalPages = Math.ceil(existingNames.length / itemsPerPage);

    // 万が一、データ件数が減ったのに currentPage が大きいままなら1ページ目に戻す
    const safeCurrentPage =
        currentPage > totalPages && totalPages > 0 ? 1 : currentPage;

    // 現在のページに表示する建物を取得
    const currentBuildings = existingNames.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage,
    );

    // フォーム入力などの「その場限りの状態」のみを管理
    const [formData, setFormData] = useState({ name: "", address: "" });
    const [editData, setEditData] = useState({ name: "", address: "" });

    // モーダル用State管理
    const [confirmModal, setConfirmModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editSuccessModal, setEditSuccessModal] = useState(false);
    const [deleteFirstConfirm, setDeleteFirstConfirm] = useState(false);
    const [deleteSecondConfirm, setDeleteSecondConfirm] = useState(false);
    const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [duplicateError, setDuplicateError] = useState("");
    const [similarityWarning, setSimilarityWarning] = useState("");
    const [processing, setProcessing] = useState(false);

    // バリデーション時は existingNames (Props) を直接参照
    const handleNameChange = (value) => {
        setFormData({ ...formData, name: value });
        setDuplicateError("");
        setSimilarityWarning("");
        if (!value.trim()) return;

        // existingNames はオブジェクトの配列と想定（念のため名前プロパティでチェック）
        const isDuplicate = existingNames.some((item) => item.name === value);
        if (isDuplicate)
            setDuplicateError("同じ名前の建物が既に登録されています");

        const similar = existingNames.filter(
            (item) =>
                calculateSimilarity(item.name, value) > 0.7 &&
                item.name !== value,
        );
        if (similar.length > 0)
            setSimilarityWarning(
                `似た名前が存在しています: ${similar.map((item) => item.name).join(", ")}`,
            );
    };

    const handleRegisterClick = () => {
        if (!formData.name) return alert("建物名を入力してください");
        if (duplicateError) return alert("入力内容に不備があります");
        setConfirmModal(true);
    };

    const handleConfirmRegister = async () => {
        setProcessing(true);
        try {
            await api.post("/administrator/buildings", formData);
            onUpdate(); // 親のデータをリフレッシュ
            setConfirmModal(false);
            setSuccessModal(true);
            setFormData({ name: "", address: "" });
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleConfirmEdit = async () => {
        setProcessing(true);
        try {
            await api.put(
                `/administrator/buildings/${editingItem.building_id}`,
                editData,
            );
            onUpdate(); // 親のデータをリフレッシュ
            setEditModal(false);
            setEditSuccessModal(true);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleSecondDeleteConfirm = async () => {
        console.log(editingItem);
        if (!editingItem || !editingItem.building_id) return;
        setProcessing(true);
        try {
            await api.delete(
                `/administrator/buildings/${editingItem.building_id}`,
            );
            onUpdate(); // 親のデータをリフレッシュ
            setDeleteSecondConfirm(false);
            setDeleteSuccessModal(true);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">建物マスタ</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <input
                    value={formData.name || ""}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="建物名"
                />
                <input
                    value={formData.address || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                        }))
                    }
                    className="w-full p-3 border rounded-lg"
                    placeholder="住所"
                />
                <button
                    onClick={handleRegisterClick}
                    disabled={processing}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    登録する
                </button>
            </div>

            {existingNames.length === 0 ? (
                <p className="text-gray-500 mt-6">建物データがありません。</p>
            ) : (
                /* PaginationWrapper でリストとページネーションコントロールをラップ */
                <PaginationWrapper
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                >
                    <ul className="mt-6 bg-white grid rounded-lg border divide-y">
                        {currentBuildings.map((item, index) => (
                            <li
                                key={item.id ?? index}
                                onClick={() => {
                                    setEditingItem(item);
                                    setEditData({
                                        name: item.name || "",
                                        address: item.address || "",
                                    });
                                    setEditModal(true);
                                }}
                                className="p-3 cursor-pointer hover:bg-blue-50"
                            >
                                <div className="font-bold">{item.name}</div>
                                <div className="text-gray-500">
                                    {item.address}
                                </div>
                            </li>
                        ))}
                    </ul>
                </PaginationWrapper>
            )}

            <CommonModal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={handleConfirmRegister}
                title="確認"
                confirmText="OK"
            >
                登録しますか？
            </CommonModal>
            <CommonModal
                isOpen={successModal}
                onClose={() => setSuccessModal(false)}
                onConfirm={() => setSuccessModal(false)}
                showCancel={false}
                title="完了"
                confirmText="OK"
            >
                登録しました。
            </CommonModal>
            <CommonModal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                onConfirm={handleConfirmEdit}
                onDelete={() => {
                    setEditModal(false);
                    setDeleteFirstConfirm(true);
                }}
                title="編集"
                confirmText="保存"
            >
                <input
                    value={editData.name}
                    onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full p-2 border"
                />
                <input
                    value={editData.address}
                    onChange={(e) =>
                        setEditData({ ...editData, address: e.target.value })
                    }
                    className="w-full p-2 border mt-2"
                />
            </CommonModal>
            <CommonModal
                isOpen={deleteFirstConfirm}
                onClose={() => setDeleteFirstConfirm(false)}
                onConfirm={() => {
                    setDeleteFirstConfirm(false);
                    setDeleteSecondConfirm(true);
                }}
                title="削除確認"
                confirmText="次へ"
                isDanger
            >
                本当に削除しますか？
            </CommonModal>
            <CommonModal
                isOpen={deleteSecondConfirm}
                onClose={() => setDeleteSecondConfirm(false)}
                onConfirm={handleSecondDeleteConfirm}
                title="最終確認"
                confirmText="削除を実行"
                isDanger
            >
                元に戻せません。
            </CommonModal>
            <CommonModal
                isOpen={deleteSuccessModal}
                onClose={() => {
                    setDeleteSuccessModal(false);
                    setEditingItem(null);
                }}
                onConfirm={() => {
                    setDeleteSuccessModal(false);
                    setEditingItem(null);
                }}
                showCancel={false}
                title="削除完了"
                confirmText="OK"
            >
                削除しました。
            </CommonModal>
        </div>
    );
}
