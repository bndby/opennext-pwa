'use client';

import { useState } from 'react';

export default function FSOpenDir() {
    const [text, setText] = useState('');

    return (
        <div>
            <button
                onClick={async () => {
                    const dirHandle = await window.showDirectoryPicker();
                    const promises = [];
                    for await (const entry of dirHandle.values()) {
                        if (entry.kind !== 'file') {
                            continue;
                        }
                        promises.push(entry.getFile().then((file) => `${file.name} (${file.size})`));
                    }
                    const text = await Promise.all(promises);
                    setText(text.join('\n'));
                }}
            >
                Открыть папку
            </button>{' '}
            <button onClick={() => setText('')}>Очистить</button>
            <pre>{text}</pre>
        </div>
    );
}
