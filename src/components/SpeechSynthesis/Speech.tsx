'use client';

import { useState } from 'react';

export const Speech = () => {
    const [text, setText] = useState('');
    return (
        <div>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            <button
                onClick={() => {
                    if ('speechSynthesis' in window) {
                        const synth = window.speechSynthesis;
                        const utterance = new SpeechSynthesisUtterance(text);
                        utterance.onend = () => {
                            setText('');
                        };
                        synth.speak(utterance);
                    }
                }}
            >
                📢 Озвучить
            </button>
        </div>
    );
};
