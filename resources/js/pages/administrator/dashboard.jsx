import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // APIを叩いてデータを取得
        axios.get('/administrator/dashboard')
            .then(response => setData(response.data))
            .catch(error => console.error('データ取得失敗', error));
    }, []);

    if (!data) return <div>読み込み中...</div>;

    return (
        <div>
            <h1>{data.title}</h1>
            <p>{data.message}</p>
        </div>
    );
}