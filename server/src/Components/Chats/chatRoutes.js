import express from "express"
import { ClearMessages, CreateChat, DeleteChat, DeleteMessage, getChats, getMessages } from "./chatController.js";

const router = express.Router();

// get user profile
router.get("/", (req, res) => {
    getChats(req, res);
});

router.post("/", (req, res) => {
    CreateChat(req, res);
});

router.get("/:chatId", (req, res) => {
    getMessages(req, res)
})
router.delete("/chat/:id", (req, res) => {
    DeleteMessage(req, res)
})
router.delete("/chat", (req, res) => {
    ClearMessages(req, res)
})

router.delete("/:id", (req, res) => {
    DeleteChat(req, res)
})



export default router
