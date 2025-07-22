'use client';

import { useState } from 'react';

export default function ChatInput({ onSend, isLoading, onStop }) {
    const [input, setInput] = useState('');

    const handleSubmit = () => {
        if (input.trim()) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="p-4 border-t border-zinc-700 flex gap-2 bg-zinc-800">
            <input
                type="text"
                className="flex-1 p-2 rounded bg-zinc-700 text-white"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-blue-600 p-2 rounded hover:bg-blue-500 disabled:opacity-50"
            >
                Send
            </button>
            <button
                onClick={onStop}
                className="bg-red-600 p-2 rounded hover:bg-red-500"
                disabled={!isLoading}
            >
                Stop
            </button>
        </div>
    );
}
