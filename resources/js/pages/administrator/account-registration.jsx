import React from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function AccountRegistration({ roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: roles[0]?.id || ''
    });

    const submit = (e) => {
        e.preventDefault();
        post('/administrator/account-registration');
    };

    return (
        <div className="p-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">アカウント新規登録</h1>
            <form onSubmit={submit} className="space-y-4">
                {/* 名前 */}
                <input 
                    className="w-full p-2 border rounded"
                    placeholder="名前"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                />
                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}

                {/* メールアドレス */}
                <input 
                    className="w-full p-2 border rounded"
                    placeholder="メール"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                />
                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}

                {/* パスワード */}
                <input 
                    type="password"
                    className="w-full p-2 border rounded"
                    placeholder="パスワード"
                    onChange={e => setData('password', e.target.value)}
                />
                <input 
                    type="password"
                    className="w-full p-2 border rounded"
                    placeholder="パスワード(確認)"
                    onChange={e => setData('password_confirmation', e.target.value)}
                />
                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}

                {/* 権限選択 */}
                <select 
                    className="w-full p-2 border rounded"
                    onChange={e => setData('role_id', e.target.value)}
                >
                    {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                </select>

                <button 
                    disabled={processing}
                    className="w-full py-2 bg-indigo-600 text-white rounded"
                >
                    登録する
                </button>
            </form>
        </div>
    );
}