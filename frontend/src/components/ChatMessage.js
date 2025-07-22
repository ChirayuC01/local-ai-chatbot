import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ChatMessage({ role, content }) {
    const [copied, setCopied] = useState(false);
    const isUser = role === 'user';
    const isTemp = role === 'assistant_temp';

    const handleCopy = async () => {
        if (typeof content === 'string') {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatContent = (text) => {
        if (typeof text !== 'string') return text;

        // Simple markdown-like formatting
        return text
            .split('\n')
            .map((line, i) => {
                // Code blocks
                if (line.startsWith('```')) {
                    return <div key={i} className="font-mono text-sm bg-zinc-800 rounded px-2 py-1 my-1">{line.replace(/```/g, '')}</div>;
                }
                // Inline code
                if (line.includes('`')) {
                    const parts = line.split('`');
                    return (
                        <div key={i}>
                            {parts.map((part, j) =>
                                j % 2 === 1 ?
                                    <code key={j} className="bg-zinc-800 px-1 rounded text-sm">{part}</code> :
                                    <span key={j}>{part}</span>
                            )}
                        </div>
                    );
                }
                // Bold text
                if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                        <div key={i}>
                            {parts.map((part, j) =>
                                j % 2 === 1 ?
                                    <strong key={j}>{part}</strong> :
                                    <span key={j}>{part}</span>
                            )}
                        </div>
                    );
                }
                return <div key={i}>{line || <br />}</div>;
            });
    };

    return (
        <div className={`group flex gap-4 p-6 animate-fadeIn message-enter ${isUser ? 'bg-transparent' : 'bg-zinc-800/30'
            }`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                }`}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-300">
                        {isUser ? 'You' : 'Assistant'}
                    </span>
                    {isTemp && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '200ms' }}></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '400ms' }}></div>
                            </div>
                            <span>typing...</span>
                        </div>
                    )}
                </div>

                <div className={`prose prose-invert max-w-none ${isUser
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tl-sm p-4 text-white'
                    : 'text-gray-100'
                    }`}>
                    {typeof content === 'string' ? formatContent(content) : content}
                </div>

                {/* Actions */}
                {!isUser && !isTemp && typeof content === 'string' && (
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded hover:bg-zinc-700/50 cursor-pointer"
                        >
                            {copied ? (
                                <>
                                    <Check size={12} className="text-green-400" />
                                    <span className="text-green-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={12} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}