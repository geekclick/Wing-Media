import express from "express"
import authorized from "../../Middlewares/authMiddleware.js";
import chatController from "./chatController.js";

const router = express.Router();
router.use(authorized)

router.get("/", (req, res) => {
    chatController.getChats(req, res);
});

router.post("/", (req, res) => {
    chatController.CreateChat(req, res);
});

router.get("/:chatId", (req, res) => {
    chatController.getMessages(req, res)
})
router.delete("/chat/:id", (req, res) => {
    chatController.DeleteMessage(req, res)
})
router.delete("/chat", (req, res) => {
    chatController.ClearMessages(req, res)
})

router.delete("/:id", (req, res) => {
    chatController.DeleteChat(req, res)
})



export default router
