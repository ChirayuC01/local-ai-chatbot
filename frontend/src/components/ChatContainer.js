import ChatMessage from './ChatMessage';
import { RefreshCw, MessageCircle } from 'lucide-react';

export default function ChatContainer({ messages, isLoading, onRetry }) {
    const hasMessages = messages.length > 0;

    return (
        <div className="flex-1 overflow-y-auto">
            {!hasMessages && !isLoading ? (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <MessageCircle size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Welcome to AI Chat
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Start a conversation by typing a message below. I'm here to help with any questions or tasks you have.
                        </p>
                        <div className="space-y-3 text-sm text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Ask questions and get detailed answers</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Get help with coding and technical topics</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span>Brainstorm ideas and solve problems</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pb-4">
                    {messages.map((msg, index) => (
                        <ChatMessage
                            key={msg.id || `temp-${index}`}
                            role={msg.role}
                            content={msg.content}
                        />
                    ))}

                    {/* Loading indicator */}
                    {isLoading && !messages.some(msg => msg.role === 'assistant_temp') && (
                        <div className="flex gap-4 p-6 bg-zinc-800/30">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <MessageCircle size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-semibold text-gray-300">Assistant</span>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <div className="flex space-x-1">
                                            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-typing" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-typing" style={{ animationDelay: '200ms' }}></div>
                                            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-typing" style={{ animationDelay: '400ms' }}></div>
                                        </div>
                                        <span>thinking...</span>
                                    </div>
                                </div>
                                <div className="bg-zinc-700/50 rounded-lg p-4 animate-pulse">
                                    <div className="h-4 bg-zinc-600/50 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-zinc-600/50 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Retry button */}
                    {!isLoading && onRetry && (
                        <div className="text-center p-6">
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center space-x-2 gradient-yellow text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 btn-hover group cursor-pointer"
                            >
                                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                                <span className="font-medium">Retry last message</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}