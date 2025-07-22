import ChatMessage from './ChatMessage';

export default function ChatContainer({ messages }) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
                <ChatMessage
                    key={msg.id || `temp-${index}`}
                    role={msg.role}
                    content={msg.content}
                />
            ))}
        </div>
    );
}
