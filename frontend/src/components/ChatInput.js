'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip, Mic } from 'lucide-react';

export default function ChatInput({ onSend, isLoading, onStop }) {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }, [input]);

    const handleSubmit = () => {
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t border-zinc-700/50 bg-zinc-900/50 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto p-4">
                <div className="relative">
                    {/* Input container */}
                    <div className="flex items-end gap-3 bg-zinc-800/80 backdrop-blur-sm rounded-2xl border border-zinc-700/50 p-3 shadow-lg">

                        {/* Text input */}
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none max-h-32 min-h-[24px] py-2"
                                placeholder="Type your message... (Shift + Enter for new line)"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                            />
                        </div>

                        {/* Send/Stop button */}
                        <div className="relative">
                            {isLoading ? (
                                <button
                                    onClick={onStop}
                                    className="p-2.5 gradient-red rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 btn-hover group cursor-pointer"
                                    title="Stop generation (Esc)"
                                >
                                    <Square size={18} className="text-white group-hover:scale-110 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!input.trim()}
                                    className={`cursor-pointer p-2.5 rounded-xl transition-all duration-300 btn-hover group ${input.trim()
                                        ? 'gradient-blue hover:shadow-lg hover:shadow-blue-500/25'
                                        : 'bg-zinc-700 text-gray-500'
                                        }`}
                                    title={input.trim() ? 'Send message (Enter)' : 'Type a message to send'}
                                >
                                    <Send size={18} className={`transition-transform group-hover:translate-x-0.5 ${input.trim() ? 'text-white' : ''
                                        }`} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Shortcuts hint */}
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                        <span>Press Enter to send • Shift + Enter for new line • Esc to stop</span>
                    </div>
                </div>
            </div>
        </div>
    );
}