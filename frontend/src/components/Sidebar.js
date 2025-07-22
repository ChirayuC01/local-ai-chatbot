'use client';

import { useState } from 'react';
import axios from 'axios';
import { Pencil, Trash, Plus, MessageCircle, Search, Settings } from 'lucide-react';

export default function Sidebar({ chats, onNewChat, onSelectChat, activeId }) {
    const [editingChatId, setEditingChatId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleRename = async (chatId) => {
        await axios.patch(`http://localhost:3001/api/chat/${chatId}/title`, {
            title: newTitle || 'Untitled Chat',
        });
        setEditingChatId(null);
        location.reload();
    };

    const handleDelete = async (chatId) => {
        if (confirm('Are you sure you want to delete this chat?')) {
            await axios.delete(`http://localhost:3001/api/chat/${chatId}`);
            location.reload();
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 bg-zinc-900/90 backdrop-blur-xl border-r border-zinc-700/50 flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-zinc-700/50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <MessageCircle size={18} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            AI Chat
                        </h1>
                    </div>
                </div>

                <button
                    onClick={onNewChat}
                    className="w-full p-3 gradient-blue rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 btn-hover flex items-center justify-center space-x-2 group cursor-pointer"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-medium">New Chat</span>
                </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-zinc-700/50">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                    {filteredChats.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No chats found</p>
                        </div>
                    ) : (
                        filteredChats.map((chat, index) => (
                            <div
                                key={chat.id}
                                className={`group relative rounded-xl transition-all duration-200 animate-slideIn ${chat.id === activeId
                                    ? 'bg-zinc-800/80 shadow-lg border border-zinc-600/50'
                                    : 'hover:bg-zinc-800/50'
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {editingChatId === chat.id ? (
                                    <div className="p-3">
                                        <input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full bg-zinc-700 p-2 text-white rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleRename(chat.id);
                                                if (e.key === 'Escape') setEditingChatId(null);
                                            }}
                                            onBlur={() => handleRename(chat.id)}
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 gap-2">
                                        <div
                                            onClick={() => onSelectChat(chat.id)}
                                            className="flex-1 min-w-0 cursor-pointer"
                                        >
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <div className={`w-2 h-2 rounded-full ${chat.id === activeId ? 'bg-blue-500' : 'bg-gray-500'}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {chat.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {new Date(chat.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            <button
                                                onClick={() => {
                                                    setNewTitle(chat.title);
                                                    setEditingChatId(chat.id);
                                                }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(chat.id)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        </div>
                                    </div>

                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-700/50">
                <div className="text-xs text-gray-400 text-center">
                    {chats.length} chat{chats.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
}