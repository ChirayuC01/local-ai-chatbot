'use client';

import { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import ChatInput from '../components/ChatInput';
import axios from 'axios';

export default function Home() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const eventSourceRef = useRef(null);

  // Fetch all chats
  const fetchChats = async () => {
    const res = await axios.get('http://localhost:3001/api/chats');
    setChats(res.data);
  };

  // Load messages for a chat
  const loadChat = async (chatId) => {
    setActiveChatId(chatId);
    const res = await axios.get(`http://localhost:3001/api/chat/${chatId}`);
    setMessages(res.data.messages);
  };

  // Create a new chat
  const handleNewChat = async () => {
    const res = await axios.post('http://localhost:3001/api/chat', {
      title: 'New Chat',
    });
    await fetchChats();
    await loadChat(res.data.id);
  };

  // Handle sending a message
  const handleSendMessage = async (content) => {
    if (!activeChatId) return;

    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    const response = await fetch(
      `http://localhost:3001/api/chat/${activeChatId}/message`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      setIsLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantReply = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process complete SSE messages
      let lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6); // Remove 'data: ' prefix

          // Skip control messages
          if (data === '[END]' || data === '[ERROR]' || data === '[DONE]') {
            continue;
          }

          // Add the data directly to assistant reply
          assistantReply += data;

          // Update UI
          setMessages((prev) => {
            const others = prev.filter((msg) => msg.role !== 'assistant_temp');
            return [...others, { role: 'assistant_temp', content: assistantReply }];
          });
        }
      }
    }

    // Process any remaining buffer
    if (buffer.startsWith('data: ')) {
      const data = buffer.substring(6);
      if (data && data !== '[END]' && data !== '[ERROR]' && data !== '[DONE]') {
        assistantReply += data;
      }
    }

    // Final cleanup
    assistantReply = assistantReply.replace(/\[END\]/g, '').trim();

    // Finalize assistant message
    setMessages((prev) => {
      const filtered = prev.filter((msg) => msg.role !== 'assistant_temp');
      return [...filtered, { role: 'assistant', content: assistantReply }];
    });

    setIsLoading(false);
  };

  // Stop generation
  const handleStop = async () => {
    if (!activeChatId) return;
    await axios.post(`http://localhost:3001/api/chat/${activeChatId}/stop`);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={(id) => loadChat(id)}
        activeId={activeChatId}
      />
      <div className="flex flex-col flex-1">
        <ChatContainer messages={messages} />
        <ChatInput onSend={handleSendMessage} onStop={handleStop} isLoading={isLoading} />
      </div>
    </>
  );
}
