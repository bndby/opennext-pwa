'use client';

export const Speech = () => {
    return (
        <div>
            <h1>Speech Synthesis</h1>
            <button
                onClick={() => {
                    const synth = window.speechSynthesis;
                    const utterance = new SpeechSynthesisUtterance('Hello, world! Привет, мир!');
                    synth.speak(utterance);
                }}
            >
                Hello, world! Привет, мир!
            </button>
        </div>
    );
};
