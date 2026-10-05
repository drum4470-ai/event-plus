import { useState, useEffect } from "react";
import api from "@/api";
import ApplicationStepIndicator from "@/Components//ApplicationStepIndicator";

export default function ApplicationDetailModal({
    isOpen,
    application: initialApplicationProp,
    applicationId,
    onClose,
    onUpdate,
    currentUser,
}) {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [data, setData] = useState({
        buildings: [],
        facilities: [],
        purposes: [],
        equipments: [],
        slots: [],
    });

    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        building_id: "",
        facility_id: "",
        facility_slot_id: "",
        purpose_id: "",
        equipment_id: [],
        event_name: "",
        usage_date: "",
        address: "",
        telephone: "",
        status: "",
        body: "",
    });

    const [initialStatus, setInitialStatus] = useState("");

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }

        const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);

        if (match) {
            const year = match[1];
            const month = match[2].padStart(2, "0");
            const day = match[3].padStart(2, "0");

            return `${year}-${month}-${day}`;
        }

        const parsed = new Date(dateStr);

        if (!isNaN(parsed.getTime())) {
            const y = parsed.getFullYear();
            const m = String(parsed.getMonth() + 1).padStart(2, "0");
            const d = String(parsed.getDate()).padStart(2, "0");

            return `${y}-${m}-${d}`;
        }

        return "";
    };

    const statusLabels = {
        新規申請: "新規申請",
        担当確認: "担当確認",
        要修正: "要修正",
        社内確認: "社内確認",
        申請手続き: "申請手続き",
        申請済み: "申請済み",
        過去の申請: "過去の申請",
    };

    const getAllowedNextStatuses = (currentStatus, role) => {
        if (role === "user") {
            switch (currentStatus) {
                case "新規申請":
                    return ["新規申請"];

                case "要修正":
                    return ["担当確認"];

                case "担当確認":
                    return ["要修正"];

                default:
                    return [];
            }
        }

        if (role === "staff") {
            switch (currentStatus) {
                case "新規申請":
                    return ["担当確認"];

                case "要修正":
                    return ["担当確認"];

                case "担当確認":
                    return ["要修正", "社内確認"];

                case "社内確認":
                    return ["担当確認"];

                case "申請手続き":
                    return ["申請済み"];

                case "申請済み":
                    return ["申請手続き"];

                default:
                    return [];
            }
        }

        if (role === "manager") {
            switch (currentStatus) {
                case "担当確認":
                    return ["社内確認"];

                case "社内確認":
                    return ["担当確認", "申請手続き"];

                default:
                    return [];
            }
        }

        if (role === "administrator") {
            switch (currentStatus) {
                case "新規申請":
                    return ["担当確認"];

                case "要修正":
                    return ["担当確認"];

                case "担当確認":
                    return ["要修正", "社内確認"];

                case "社内確認":
                    return ["要修正", "担当確認", "申請手続き"];

                case "申請手続き":
                    return ["申請済み", "要修正", "担当確認", "社内確認"];

                case "申請済み":
                    return ["申請手続き"];

                default:
                    return [];
            }
        }

        return [];
    };

    /*
     * 申請詳細とマスタ関連データを取得
     */
    useEffect(() => {
        if (!applicationId) return;

        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const [relationsRes, detailRes] = await Promise.all([
                    api.get("/user/applications/relations"),
                    api.get(`/user/applications/${applicationId}`),
                ]);

                const relData = relationsRes.data;

                setData({
                    buildings: relData.buildings ?? [],
                    facilities: relData.facilities ?? [],
                    purposes: relData.purposes ?? [],
                    equipments: relData.equipments ?? [],
                    slots: relData.slots ?? [],
                });

                const appData = detailRes.data.data ?? detailRes.data;

                setApplication(appData);

                const currentStatus = appData.status ?? "新規申請";

                setInitialStatus(currentStatus);

                const buildingId =
                    appData.building_id ||
                    appData.facility?.building_id ||
                    appData.facility?.building?.building_id ||
                    appData.facilities?.buildings?.building_id ||
                    "";

                setEditForm({
                    building_id: buildingId ? String(buildingId) : "",

                    facility_id:
                        appData.facility_id ||
                        appData.facility?.facility_id ||
                        "",

                    facility_slot_id:
                        appData.facility_slot_id ||
                        appData.facility_slot?.facility_slot_id ||
                        "",

                    purpose_id:
                        appData.purpose_id || appData.purpose?.purpose_id || "",

                    equipment_id:
                        appData.equipments?.map((eq) =>
                            Number(eq.equipment_id ?? eq.id),
                        ) || [],

                    event_name: appData.event_name || "",

                    usage_date: formatDateForInput(appData.usage_date),

                    address: appData.address || "",

                    telephone: appData.telephone || "",

                    status: currentStatus,

                    body: "",
                });
            } catch (err) {
                console.error("データの取得に失敗しました:", err);

                setError("データの取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        setIsEditing(false);
    }, [applicationId]);

    const currentRole =
        typeof currentUser === "string"
            ? currentUser
            : (currentUser?.role ?? "user");

    const allowedStatuses = application
        ? getAllowedNextStatuses(application.status ?? "新規申請", currentRole)
        : [];

    const canEdit = allowedStatuses.length > 0;

    const handleDelete = async () => {
        if (!confirm("本当にこの申請を削除しますか？")) {
            return;
        }

        try {
            await api.delete(`/user/applications/${applicationId}`);

            alert("削除しました");

            onClose();

            if (typeof onUpdate === "function") {
                onUpdate();
            }
        } catch (err) {
            console.error("削除に失敗しました:", err);

            alert("削除に失敗しました。");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const isStatusChanged = editForm.status !== initialStatus;
        const isCommentAdded = editForm.body.trim() !== "";
        const isContentChanged =
            editForm.building_id !==
                String(
                    application?.building_id ??
                        application?.facility?.building_id ??
                        "",
                ) ||
            String(editForm.facility_id) !==
                String(
                    application?.facility_id ??
                        application?.facility?.facility_id ??
                        "",
                ) ||
            String(editForm.facility_slot_id) !==
                String(
                    application?.facility_slot_id ??
                        application?.facility_slot?.facility_slot_id ??
                        "",
                ) ||
            String(editForm.purpose_id) !==
                String(
                    application?.purpose_id ??
                        application?.purpose?.purpose_id ??
                        "",
                ) ||
            editForm.event_name !== (application?.event_name ?? "") ||
            editForm.usage_date !==
                formatDateForInput(application?.usage_date) ||
            editForm.address !== (application?.address ?? "") ||
            editForm.telephone !== (application?.telephone ?? "");

        if (!isStatusChanged && !isCommentAdded && !isContentChanged) {
            const confirmed = window.confirm(
                "変更がありません。このまま保存しますか？",
            );

            if (!confirmed) {
                return;
            }
        }

        try {
            await api.put(`/user/applications/${applicationId}`, editForm);
            alert("更新しました");
            setIsEditing(false);
            if (typeof onUpdate === "function") {
                onUpdate();
            }
            const res = await api.get(`/user/applications/${applicationId}`);
            const updatedAppData = res.data.data ?? res.data;
            setApplication(updatedAppData);

            const updatedStatus = updatedAppData.status ?? "新規申請";
            setInitialStatus(updatedStatus);
            setEditForm((prev) => ({
                ...prev,
                usage_date: formatDateForInput(updatedAppData.usage_date),
                status: updatedStatus,
                body: "",
            }));
        } catch (err) {
            alert("更新に失敗しました。");
        }
    };

    if (!isOpen || !applicationId) {
        return null;
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-2">
            {" "}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden p-2">
                <div className="flex justify-between items-center border-b pb-2">
                    {" "}
                    <h2 className="text-xl font-bold text-gray-800">
                        申請詳細 (ID: {applicationId})
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                {loading && (
                    <div className="py-12 text-center text-gray-500">
                        読み込み...
                    </div>
                )}

                {error && (
                    <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {!loading && !error && application && (
                    <div>
                        <ApplicationStepIndicator
                            currentStatus={application.status}
                        />
                        <div className="flex justify-between items-center mb-6 bg-gray-50 p-3 rounded-lg">
                            {" "}
                            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                {statusLabels[application.status] ??
                                    application.status ??
                                    "新規申請"}
                            </span>
                            <div>
                                {canEdit && !isEditing && (
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                                        >
                                            編集・対応
                                        </button>

                                        <button
                                            onClick={handleDelete}
                                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                                        >
                                            削除
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isEditing ? (
                            <div className="space-y-4">
                                {/* 申請内容 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <strong className="text-gray-500 block">
                                            イベント名:
                                        </strong>

                                        {application.event_name || "未設定"}
                                    </div>

                                    <div>
                                        <strong className="text-gray-500 block">
                                            利用日:
                                        </strong>

                                        {application.usage_date || "未設定"}
                                    </div>

                                    <div>
                                        <strong className="text-gray-500 block">
                                            建物:
                                        </strong>

                                        {application.facility?.building?.name ??
                                            application.facilities?.buildings
                                                ?.name ??
                                            "未指定"}
                                    </div>

                                    <div>
                                        <strong className="text-gray-500 block">
                                            施設:
                                        </strong>

                                        {application.facility?.name ??
                                            application.facilities?.name ??
                                            "未指定"}
                                    </div>

                                    <div>
                                        <strong className="text-gray-500 block">
                                            利用目的:
                                        </strong>

                                        {application.purpose?.name ??
                                            application.purposes?.name ??
                                            "未指定"}
                                    </div>

                                    <div>
                                        <strong className="text-gray-500 block">
                                            時間枠:
                                        </strong>

                                        {application.slot?.name ??
                                            application.facility_slots?.slots
                                                ?.name ??
                                            "未指定"}
                                    </div>

                                    {/* 備品 */}
                                    <div className="md:col-span-2">
                                        <h3 className="font-bold text-gray-700 mb-2 text-sm">
                                            利用備品
                                        </h3>

                                        {application.equipments &&
                                        application.equipments.length > 0 ? (
                                            <ul className="list-disc list-inside bg-white p-3 rounded-lg text-sm space-y-1 border">
                                                {application.equipments.map(
                                                    (eq) => (
                                                        <li
                                                            key={
                                                                eq.id ??
                                                                eq.equipment_id
                                                            }
                                                        >
                                                            {eq.name}
                                                            （数量:{" "}
                                                            {eq.pivot
                                                                ?.quantity ??
                                                                eq.quantity ??
                                                                1}
                                                            ）
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-400">
                                                利用する備品はありません
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* コメント履歴 */}
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2 text-sm">
                                        コメント履歴
                                    </h3>

                                    {application.application_comments &&
                                    application.application_comments.length >
                                        0 ? (
                                        <div className="space-y-2">
                                            {application.application_comments.map(
                                                (comment) => (
                                                    <div
                                                        key={
                                                            comment.comment_id ??
                                                            comment.id
                                                        }
                                                        className="bg-gray-50 p-3 rounded-lg text-sm border"
                                                    >
                                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                            <span>
                                                                {comment.users
                                                                    ?.role ??
                                                                    "担当者"}
                                                                {" : "}
                                                                {comment.users
                                                                    ?.name ??
                                                                    "担当者"}
                                                            </span>

                                                            <span>
                                                                {
                                                                    comment.created_at
                                                                }
                                                            </span>
                                                        </div>

                                                        <p className="text-gray-700">
                                                            {comment.body}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400">
                                            コメントはありません
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                {/* =====================
                                        ステータス変更
                                    ===================== */}
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <label className="block text-xs font-bold text-indigo-900 mb-1">
                                        ステータス変更
                                    </label>

                                    <select
                                        value={editForm.status || ""}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                status: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg p-2 text-sm bg-white"
                                    >
                                        {/* 現在のステータス */}
                                        <option value={initialStatus}>
                                            現在：
                                            {statusLabels[initialStatus] ??
                                                initialStatus}
                                        </option>

                                        {/* 変更可能なステータスのみ */}
                                        {allowedStatuses.map((status) => (
                                            <option key={status} value={status}>
                                                {statusLabels[status] ?? status}
                                            </option>
                                        ))}
                                    </select>

                                    {allowedStatuses.length === 0 && (
                                        <p className="mt-2 text-xs text-gray-500">
                                            現在のステータスから変更できる次のステータスはありません。
                                        </p>
                                    )}
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <label className="block text-xs font-bold text-indigo-900 mb-1">
                                        コメント追記
                                    </label>

                                    <textarea
                                        rows="3"
                                        value={editForm.body || ""}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                body: e.target.value,
                                            }))
                                        }
                                        placeholder="申請者への連絡事項やメモを入力してください..."
                                        className="w-full border rounded-lg p-2 text-sm bg-white"
                                    />
                                </div>

                                <hr className="my-2" />

                                <p className="text-xs font-bold text-gray-500">
                                    申請内容の編集
                                </p>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        建物
                                    </label>

                                    <select
                                        value={editForm.building_id || ""}
                                        onChange={(e) => {
                                            const buildingId = e.target.value;

                                            setEditForm((prev) => ({
                                                ...prev,
                                                building_id: buildingId,
                                                facility_id: "",
                                                purpose_id: "",
                                                facility_slot_id: "",
                                                equipment_id: [],
                                            }));
                                        }}
                                        className="w-full border rounded-lg p-2 text-sm"
                                    >
                                        <option value="">
                                            建物を選択してください
                                        </option>

                                        {(data.buildings ?? []).map(
                                            (building) => (
                                                <option
                                                    key={building.building_id}
                                                    value={building.building_id}
                                                >
                                                    {building.name}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        施設
                                    </label>

                                    <select
                                        value={editForm.facility_id || ""}
                                        onChange={(e) => {
                                            const facilityId = e.target.value;

                                            setEditForm((prev) => ({
                                                ...prev,
                                                facility_id: facilityId,
                                                purpose_id: "",
                                                facility_slot_id: "",
                                                equipment_id: [],
                                            }));
                                        }}
                                        disabled={!editForm.building_id}
                                        className="w-full border rounded-lg p-2 text-sm disabled:bg-gray-100"
                                    >
                                        <option value="">
                                            施設を選択してください
                                        </option>

                                        {(data.facilities ?? [])
                                            .filter(
                                                (facility) =>
                                                    String(
                                                        facility.building_id,
                                                    ) ===
                                                    String(
                                                        editForm.building_id,
                                                    ),
                                            )
                                            .map((facility) => (
                                                <option
                                                    key={facility.facility_id}
                                                    value={facility.facility_id}
                                                >
                                                    {facility.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        利用目的
                                    </label>

                                    <select
                                        value={editForm.purpose_id || ""}
                                        onChange={(e) => {
                                            setEditForm((prev) => ({
                                                ...prev,
                                                purpose_id: e.target.value,
                                                equipment_id: [],
                                            }));
                                        }}
                                        disabled={!editForm.facility_id}
                                        className="w-full border rounded-lg p-2 text-sm disabled:bg-gray-100"
                                    >
                                        <option value="">
                                            目的を選択してください
                                        </option>

                                        {(() => {
                                            const currentFacility = (
                                                data.facilities ?? []
                                            ).find(
                                                (facility) =>
                                                    String(
                                                        facility.facility_id,
                                                    ) ===
                                                    String(
                                                        editForm.facility_id,
                                                    ),
                                            );

                                            if (
                                                !currentFacility ||
                                                !currentFacility.facility_purposes
                                            ) {
                                                return null;
                                            }

                                            return currentFacility.facility_purposes.map(
                                                (fp) => {
                                                    const purpose = fp.purposes;

                                                    if (!purpose) {
                                                        return null;
                                                    }

                                                    return (
                                                        <option
                                                            key={
                                                                purpose.purpose_id
                                                            }
                                                            value={
                                                                purpose.purpose_id
                                                            }
                                                        >
                                                            {purpose.name}
                                                        </option>
                                                    );
                                                },
                                            );
                                        })()}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        設備（複数選択可）
                                    </label>

                                    <div className="space-y-2 border p-3 rounded-lg bg-gray-50 text-sm">
                                        {(() => {
                                            const currentFacility = (
                                                data.facilities ?? []
                                            ).find(
                                                (facility) =>
                                                    String(
                                                        facility.facility_id,
                                                    ) ===
                                                    String(
                                                        editForm.facility_id,
                                                    ),
                                            );

                                            const matchedPurpose =
                                                currentFacility?.facility_purposes?.find(
                                                    (fp) =>
                                                        String(
                                                            fp.purpose_id,
                                                        ) ===
                                                        String(
                                                            editForm.purpose_id,
                                                        ),
                                                );

                                            const availableEquipmentIds =
                                                matchedPurpose?.facility_purpose_equipments?.map(
                                                    (fpe) =>
                                                        Number(
                                                            fpe.equipment_id,
                                                        ),
                                                ) ?? [];

                                            if (
                                                !editForm.facility_id ||
                                                !editForm.purpose_id
                                            ) {
                                                return (
                                                    <p className="text-xs text-gray-500">
                                                        施設と利用目的を選択すると設備が表示されます。
                                                    </p>
                                                );
                                            }

                                            const filteredEquipments = (
                                                data.equipments ?? []
                                            ).filter((equipment) =>
                                                availableEquipmentIds.includes(
                                                    Number(
                                                        equipment.equipment_id,
                                                    ),
                                                ),
                                            );

                                            if (
                                                filteredEquipments.length === 0
                                            ) {
                                                return (
                                                    <p className="text-xs text-gray-500">
                                                        この目的に利用可能な設備はありません。
                                                    </p>
                                                );
                                            }

                                            return filteredEquipments.map(
                                                (equipment) => {
                                                    const equipmentId = Number(
                                                        equipment.equipment_id,
                                                    );

                                                    return (
                                                        <label
                                                            key={
                                                                equipment.equipment_id
                                                            }
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={
                                                                    equipmentId
                                                                }
                                                                checked={
                                                                    Array.isArray(
                                                                        editForm.equipment_id,
                                                                    ) &&
                                                                    editForm.equipment_id.includes(
                                                                        equipmentId,
                                                                    )
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const id =
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        );

                                                                    setEditForm(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            equipment_id:
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                                    ? [
                                                                                          ...(prev.equipment_id ||
                                                                                              []),
                                                                                          id,
                                                                                      ]
                                                                                    : (
                                                                                          prev.equipment_id ||
                                                                                          []
                                                                                      ).filter(
                                                                                          (
                                                                                              item,
                                                                                          ) =>
                                                                                              Number(
                                                                                                  item,
                                                                                              ) !==
                                                                                              id,
                                                                                      ),
                                                                        }),
                                                                    );
                                                                }}
                                                            />

                                                            <span>
                                                                {equipment.name}
                                                            </span>
                                                        </label>
                                                    );
                                                },
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        時間枠
                                    </label>

                                    <select
                                        value={editForm.facility_slot_id || ""}
                                        onChange={(e) => {
                                            setEditForm((prev) => ({
                                                ...prev,
                                                facility_slot_id:
                                                    e.target.value,
                                            }));
                                        }}
                                        disabled={!editForm.facility_id}
                                        className="w-full border rounded-lg p-2 text-sm disabled:bg-gray-100"
                                    >
                                        <option value="">
                                            時間枠を選択してください
                                        </option>

                                        {(() => {
                                            const currentFacility = (
                                                data.facilities ?? []
                                            ).find(
                                                (facility) =>
                                                    String(
                                                        facility.facility_id,
                                                    ) ===
                                                    String(
                                                        editForm.facility_id,
                                                    ),
                                            );

                                            if (
                                                !currentFacility ||
                                                !currentFacility.facility_slots
                                            ) {
                                                return null;
                                            }

                                            return currentFacility.facility_slots.map(
                                                (fs) => {
                                                    const slot = fs.slots;

                                                    if (!slot) {
                                                        return null;
                                                    }

                                                    const slotName =
                                                        slot.name ??
                                                        `${slot.start_time} 〜 ${slot.end_time}`;

                                                    return (
                                                        <option
                                                            key={
                                                                fs.facility_slot_id
                                                            }
                                                            value={
                                                                fs.facility_slot_id
                                                            }
                                                        >
                                                            {slotName}
                                                        </option>
                                                    );
                                                },
                                            );
                                        })()}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        利用日
                                    </label>

                                    <input
                                        type="date"
                                        value={editForm.usage_date || ""}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                usage_date: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg p-2 text-sm"
                                    />
                                </div>

                                {/* =====================
                                        イベント名
                                    ===================== */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        イベント名
                                    </label>

                                    <input
                                        type="text"
                                        value={editForm.event_name || ""}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                event_name: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg p-2 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            住所
                                        </label>

                                        <input
                                            type="text"
                                            value={editForm.address || ""}
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    address: e.target.value,
                                                }))
                                            }
                                            className="w-full border rounded-lg p-2 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            電話番号
                                        </label>

                                        <input
                                            type="text"
                                            value={editForm.telephone || ""}
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    telephone: e.target.value,
                                                }))
                                            }
                                            className="w-full border rounded-lg p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                                    >
                                        キャンセル
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                    >
                                        保存する
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                <div className="mt-6 pt-4 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
}
