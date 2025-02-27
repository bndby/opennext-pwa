'use client';

import { useState } from 'react';

export default function FSOpenText() {
    const [text, setText] = useState('');

    return (
        <div>
            <button
                onClick={async () => {
                    const fileHandle = await window.showOpenFilePicker();
                    const file = await fileHandle[0].getFile();
                    const text = await file.text();
                    setText(text);
                }}
            >
                Открыть текстовый файл
            </button>{' '}
            <button onClick={() => setText('')}>Очистить</button>
            <p>{text}</p>
        </div>
    );
}
