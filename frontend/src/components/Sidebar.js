'use client';

import { useState } from 'react';
import axios from 'axios';
import { Pencil, Trash } from 'lucide-react';

export default function Sidebar({ chats, onNewChat, onSelectChat, activeId }) {
    const [editingChatId, setEditingChatId] = useState(null);
    const [newTitle, setNewTitle] = useState('');

    const handleRename = async (chatId) => {
        await axios.patch(`http://localhost:3001/api/chat/${chatId}/title`, {
            title: newTitle || 'Untitled Chat',
        });
        setEditingChatId(null);
        location.reload(); // or call a prop to refresh chats
    };

    const handleDelete = async (chatId) => {
        await axios.delete(`http://localhost:3001/api/chat/${chatId}`);
        location.reload();
    };

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
                        className={`group flex items-center justify-between gap-1 p-2 rounded cursor-pointer ${chat.id === activeId ? 'bg-zinc-700' : 'hover:bg-zinc-700'
                            }`}
                    >
                        {editingChatId === chat.id ? (
                            <>
                                <input
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="flex-1 bg-zinc-700 p-1 text-white rounded"
                                    onKeyDown={(e) => e.key === 'Enter' && handleRename(chat.id)}
                                    autoFocus
                                />
                            </>
                        ) : (
                            <>
                                <div onClick={() => onSelectChat(chat.id)} className="flex-1 truncate">
                                    {chat.title}
                                </div>
                                <button
                                    onClick={() => {
                                        setNewTitle(chat.title);
                                        setEditingChatId(chat.id);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(chat.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash size={14} />
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
