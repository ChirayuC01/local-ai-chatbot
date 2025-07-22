import ChatMessage from './ChatMessage';

export default function ChatContainer({ messages, isLoading, onRetry }) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
                <ChatMessage
                    key={msg.id || `temp-${index}`}
                    role={msg.role}
                    content={msg.content}
                />
            ))}

            {isLoading && (
                <ChatMessage
                    role="assistant"
                    content={
                        <span className="animate-pulse text-gray-400">
                            Typing<span className="animate-bounce">...</span>
                        </span>
                    }
                />
            )}

            {!isLoading && onRetry && (
                <div className="text-center mt-4">
                    <button
                        onClick={onRetry}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                        🔁 Retry last message
                    </button>
                </div>
            )}
        </div>
    );
}
