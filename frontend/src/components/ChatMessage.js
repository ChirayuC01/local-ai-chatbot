export default function ChatMessage({ role, content }) {
    const isUser = role === 'user';
    return (
        <div className={`my-2 ${isUser ? 'text-right' : 'text-left'}`}>
            <div
                className={`inline-block px-4 py-2 rounded ${isUser ? 'bg-blue-500' : 'bg-zinc-700'
                    }`}
            >
                {content}
            </div>
        </div>
    );
}
