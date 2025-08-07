'use client';

import { useState } from 'react';
import { useBrowserSupport } from '@/hooks/useClientSide';

export const Speech = () => {
    const [text, setText] = useState('');
    const [isClient, isSupported] = useBrowserSupport('speechSynthesis');

    const handleSpeak = () => {
        if (!isSupported) {
            alert('Speech Synthesis не поддерживается в вашем браузере');
            return;
        }

        if (!text.trim()) {
            alert('Введите текст для озвучивания');
            return;
        }

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onend = () => {
            setText('');
        };

        utterance.onerror = (event) => {
            console.error('Ошибка синтеза речи:', event);
        };

        synth.speak(utterance);
    };

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите текст для озвучивания..."
                aria-label="Текст для синтеза речи"
                disabled={!isSupported}
            />
            <button onClick={handleSpeak} disabled={!isSupported || !text.trim()}>
                📢 Озвучить
            </button>
            {!isSupported && <p style={{ color: 'red' }}>Speech Synthesis не поддерживается в вашем браузере</p>}
        </div>
    );
};
