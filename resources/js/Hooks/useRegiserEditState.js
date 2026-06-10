import { useState } from 'react';

export const useRegisterEditState = () => {
    const [confirmModal, setConfirmModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editSuccessModal, setEditSuccessModal] = useState(false);
    const [deleteFirstConfirm, setDeleteFirstConfirm] = useState(false);
    const [deleteSecondConfirm, setDeleteSecondConfirm] = useState(false);
    const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
    const [duplicateError, setDuplicateError] = useState('');
    const [similarityWarning, setSimilarityWarning] = useState('');
    const [registeredName, setRegisteredName] = useState('');

    return {
        confirmModal, setConfirmModal,
        successModal, setSuccessModal,
        editingItem, setEditingItem,
        editModal, setEditModal,
        editSuccessModal, setEditSuccessModal,
        deleteFirstConfirm, setDeleteFirstConfirm,
        deleteSecondConfirm, setDeleteSecondConfirm,
        deleteSuccessModal, setDeleteSuccessModal,
        duplicateError, setDuplicateError,
        similarityWarning, setSimilarityWarning,
        registeredName, setRegisteredName
    };
};