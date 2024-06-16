import { createError, createResponse, decodeToken } from "../../Helpers/index.js";
import { Chat } from "../../Models/chatModel.js";
import { Message } from "../../Models/messageModel.js";

export const handleConnection = (io, socket) => {
    console.log('User connected:', socket.user._id);

    socket.on('joinRoom', (roomId) => {
        console.log(`User:${socket.id} joined room: ${roomId}`);
        socket.join(roomId);
    });

    socket.on('sendMessage', async (message) => {
        try {
            const newMessage = new Chat({
                sender: socket.user._id,
                room: message.room,
                content: message.content,
            });
            await newMessage.save();

            // Use socket.broadcast.to to send the message to all other clients in the room except the sender
            socket.broadcast.to(message.room).emit('receiveMessage', newMessage);
        } catch (error) {
            console.error("Error saving message: ", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.user._id);
    });
};

export const getChats = async (req, res) => {
    try {
        const token = decodeToken(req)
        if (token) {
            const chats = await Chat.find();
            if (chats) {
                createResponse(res, 200, "Chats got", chats, 200);
            } else {
                createError(res, 400, "No chats found");
            }
        }
    } catch (error) {
        console.error("Error fetching chats: ", error);
        createError(res, 500, "Internal Server Error");
    }
};

export const getMessages = async (req, res) => {
    try {
        const token = decodeToken(req)
        if (token) {
            const chatId = req.params.chatId
            const messages = await Message.find();
            if (messages) {
                const chatMessages = messages.filter((m) => m.chat == chatId)
                return createResponse(res, 200, "Messages got", chatMessages, 200)
            }
            return createError(res, 400, "Messages not found")

        }
    } catch (error) {
        console.error("Error fetching chats: ", error);
        createError(res, 500, "Internal Server Error");
    }
};
export const ClearMessages = async (req, res) => {
    try {
        const token = decodeToken(req)
        const io = req.app.get("io")
        if (token) {
            const chatId = req.query.chatId
            const messages = await Message.deleteMany({ chat: chatId });
            if (messages) {
                io.emit("REFETCH_MESSAGES")
                return createResponse(res, 200, "Messages cleared!", null, 200)
            }
            return createError(res, 400, "Chat not found")

        }
    } catch (error) {
        console.error("Error fetching chats: ", error);
        createError(res, 500, "Internal Server Error");
    }
};

export const DeleteMessage = async (req, res) => {
    try {
        const token = decodeToken(req)
        const io = req.app.get("io")
        if (token) {
            const messageId = req.params.id
            const messages = await Message.findByIdAndDelete(messageId);
            if (messages) {
                io.emit("REFETCH_MESSAGES")
                return createResponse(res, 200, "Message deleted!", 200)
            }
            return createError(res, 400, "Chat not found")

        }
    } catch (error) {
        console.error("Error fetching chats: ", error);
        createError(res, 500, "Internal Server Error");
    }
};

export const DeleteChat = async (req, res) => {
    try {
        const token = decodeToken(req)
        if (token) {
            const chatId = req.params.id
            const chat = await Chat.findByIdAndDelete(chatId);
            if (chat) {
                return createResponse(res, 200, "Chat deleted!", 200)
            }
            return createError(res, 400, "Chat not found")

        }
    } catch (error) {
        console.error("Error fetching chats: ", error);
        createError(res, 500, "Internal Server Error");
    }
};

export const CreateChat = async (req, res) => {
    try {
        const token = decodeToken(req)
        if (token) {
            const { name, members } = req.body
            const chat = await Chat.create({
                members,
                name: name,
            });
            if (chat) {
                return createResponse(res, 200, "Chat chat created!", chat._id, 200)
            }
            return createError(res, 400, "unable to create chat")

        }
    } catch (error) {
        console.error("Error fetching chats: ", error);
        createError(res, 500, "Internal Server Error");
    }
};
