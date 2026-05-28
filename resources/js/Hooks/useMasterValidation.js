// hooks/useMasterValidation.js
import { useState, useEffect } from 'react';

export function useMasterValidation(name, existingNames, label) {
    const [customError, setCustomError] = useState('');
    const [isSimilar, setIsSimilar] = useState(false);

    useEffect(() => {
        const inputName = name ? name.trim() : '';
        if (!inputName) {
            setCustomError('');
            setIsSimilar(false);
            return;
        }

        const isExactMatch = existingNames.includes(inputName);
        const similarMatch = existingNames.find(existing => 
            existing.includes(inputName) || inputName.includes(existing)
        );

        if (isExactMatch) {
            setCustomError(`この${label}名は既に登録されています。`);
            setIsSimilar(false);
        } else if (similarMatch) {
            setCustomError(`類似した${label}名（${similarMatch}）が既に登録されています。重複の可能性がありますが本当に登録しますか？`);
            setIsSimilar(true);
        } else {
            setCustomError('');
            setIsSimilar(false);
        }
    }, [name, existingNames, label]);

    return { customError, isSimilar, setCustomError, setIsSimilar };
}