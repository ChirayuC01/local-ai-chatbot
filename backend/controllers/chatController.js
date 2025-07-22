const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateStream } = require('../utils/ollama');

const abortControllers = new Map();

async function createChat(req, res) {
    const { title } = req.body;

    const chat = await prisma.chat.create({
        data: {
            title: title || 'New Chat',
        },
    });

    res.status(201).json(chat);
}

async function getChats(req, res) {
    const chats = await prisma.chat.findMany({
        orderBy: { createdAt: 'desc' },
    });

    res.json(chats);
}

async function getChatHistory(req, res) {
    const { chatId } = req.params;

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                messages: {
                    orderBy: { timestamp: 'asc' },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.json(chat);
    } catch (err) {
        console.error('Error getting chat history:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


async function sendMessage(req, res) {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
    }

    // Save user message to DB
    await prisma.message.create({
        data: {
            chatId,
            role: 'user',
            content,
        },
    });

    // Setup streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let assistantReply = '';
    let hasEnded = false;

    const onData = (token) => {
        assistantReply += token;
        res.write(`data: ${token}\n\n`);
    };

    const onEnd = async () => {
        if (hasEnded) return;
        hasEnded = true;

        abortControllers.delete(chatId);

        await prisma.message.create({
            data: {
                chatId,
                role: 'assistant',
                content: assistantReply,
            },
        });

        res.write(`data: [END]\n\n`);
        res.end();
    };

    const onError = (err) => {
        if (hasEnded) return;
        hasEnded = true;

        abortControllers.delete(chatId);
        console.error('Streaming error:', err);
        res.write(`data: [ERROR]\n\n`);
        res.end();
    };

    const controller = new AbortController();
    abortControllers.set(chatId, controller);

    generateStream(content, onData, onEnd, onError, controller.signal);
}

function stopMessage(req, res) {
    const { chatId } = req.params;

    const controller = abortControllers.get(chatId);

    if (controller) {
        controller.abort();
        abortControllers.delete(chatId);
        return res.json({ message: 'Generation stopped.' });
    } else {
        return res.status(404).json({ error: 'No active generation found.' });
    }
}

async function updateChatTitle(req, res) {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const updated = await prisma.chat.update({
            where: { id: chatId },
            data: { title },
        });
        res.json(updated);
    } catch (err) {
        console.error('Update title error:', err);
        res.status(500).json({ error: 'Failed to update title' });
    }
}

async function deleteChat(req, res) {
    const { chatId } = req.params;

    try {
        await prisma.message.deleteMany({ where: { chatId } }); // delete messages first
        await prisma.chat.delete({ where: { id: chatId } });

        res.json({ success: true });
    } catch (err) {
        console.error('Delete chat error:', err);
        res.status(500).json({ error: 'Failed to delete chat' });
    }
}


module.exports = {
    createChat,
    getChats,
    sendMessage,
    stopMessage,
    getChatHistory,
    updateChatTitle,
    deleteChat,
};
