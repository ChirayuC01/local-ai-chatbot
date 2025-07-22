'use client';

export default function Sidebar({ chats, onNewChat, onSelectChat, activeId }) {
    return (
        <div className="w-64 bg-zinc-800 p-4 flex flex-col">
            <button
                onClick={onNewChat}
                className="mb-4 p-2 bg-blue-600 rounded hover:bg-blue-500"
            >
                + New Chat
            </button>

            <div className="flex-1 overflow-y-auto space-y-2">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`cursor-pointer p-2 rounded hover:bg-zinc-700 ${chat.id === activeId ? 'bg-zinc-700' : ''
                            }`}
                    >
                        {chat.title}
                    </div>
                ))}
            </div>
        </div>
    );
}
