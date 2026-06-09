// resources/js/Components/CommonModal.jsx
import React from 'react';
import { useForm } from '@inertiajs/react';

// resources/js/Components/CommonModal.jsx
export default function CommonModal({ isOpen, onClose, editingItem, fields, submitUrl, idKey = 'id' }) {
    // ... useForm の初期化は同じ
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const action = editingItem ? put : post;
        // idKeyを使ってURLを動的に生成
        const url = editingItem ? `${submitUrl}/${editingItem[idKey]}` : submitUrl;
        
        action(url, { onSuccess: onClose });
    };

    return (
        // ... モーダルの枠組みは同じ
        <form onSubmit={handleSubmit}>
            {fields.map((field) => (
                <div key={field.name} className="mb-4">
                    <label className="block text-sm font-medium">{field.label}</label>
                    
                    {field.type === 'select' ? (
                        <select 
                            className="w-full border rounded p-2"
                            value={data[field.name]}
                            onChange={(e) => setData(field.name, e.target.value)}
                        >
                            <option value="">選択してください</option>
                            {field.options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={data[field.name]}
                            onChange={(e) => setData(field.name, e.target.value)}
                        />
                    )}
                    {errors[field.name] && <span className="text-red-500 text-xs">{errors[field.name]}</span>}
                </div>
            ))}
            {/* ... ボタン類 */}
        </form>
    );
}