import { createError, createResponse } from "../../Helpers/index.js";
import { TryCatch } from "../../Middlewares/errorMiddleware.js";
import { Chat } from "../../Models/chatModel.js";
import { Message } from "../../Models/messageModel.js";

export const getChats = TryCatch(async (req, res, next) => {
    const chats = await Chat.find();
    if (chats) {
        createResponse(res, 200, "Chats got", chats, 200);
    } else {
        createError(res, 404, "No chats found");
    }
});

export const getMessages = TryCatch(async (req, res, next) => {
    const chatId = req.params.chatId
    if (!chatId) return createError(res, 400, "Chat id is not provided");

    const messages = await Message.find();
    if (messages) {
        const chatMessages = messages.filter((m) => m.chat == chatId)
        return createResponse(res, 200, "Messages got", chatMessages, 200)
    }
    return createError(res, 404, "Messages not found")

})
export const ClearMessages = TryCatch(async (req, res, next) => {
    const io = req.app.get("io")
    const chatId = req.query.chatId
    const messages = await Message.deleteMany({ chat: chatId });
    if (messages) {
        io.emit("REFETCH_MESSAGES")
        return createResponse(res, 204, "Messages cleared!", 204)
    }
    return createError(res, 404, "Chat not found")

})

export const DeleteMessage = TryCatch(async (req, res, next) => {
    const io = req.app.get("io")
    const messageId = req.params.id
    const messages = await Message.findByIdAndDelete(messageId);
    if (messages) {
        io.emit("REFETCH_MESSAGES")
        return createResponse(res, 204, "Message deleted!", 204)
    }
    return createError(res, 404, "Chat not found")

})

export const DeleteChat = TryCatch(async (req, res, next) => {
    const chatId = req.params.id
    const chat = await Chat.findByIdAndDelete(chatId);
    if (chat) {
        return createResponse(res, 204, "Chat deleted!", 204)
    }
    return createError(res, 404, "Chat not found")

});

export const CreateChat = TryCatch(async (req, res, next) => {
    const { name, members } = req.body
    const chat = await Chat.create({
        members,
        name: name,
    });
    if (chat) {
        return createResponse(res, 201, "Chat chat created!", chat._id, 201)
    }
    return createError(res, 404, "Chat not found")

});
