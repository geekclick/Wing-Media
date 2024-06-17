import express from "express"
import userController from "./userController.js";
import authorized from "../../Middlewares/authMiddleware.js";
import { singleImage } from "../../Middlewares/multerMiddleware.js";

const router = express.Router();
router.use(authorized)

// get my prfile
router.get("/me", (req, res) => {
    userController.profile(req, res);
});

// get user by id
router.get("/user/:id", (req, res) => {
    userController.getUser(req, res);
});

// update my profile
router.put("/user/updateProfile", singleImage, (req, res) => {
    userController.updateProfile(req, res);
});

// search user
router.get("/search", (req, res) => {
    userController.searchUser(req, res)
})

// get notifications
router.get("/notifications", (req, res) => {
    userController.getNotifications(req, res)
})

// get friends
router.get("/friends", (req, res) => {
    userController.getFriends(req, res)
})

// send request
router.post("/sendrequest", (req, res) => {
    userController.sendFriendsRequest(req, res)
})

// accept request
router.post("/acceptrequest", (req, res) => {
    userController.acceptFriendRequest(req, res)
})

router.get("/friends", (req, res) => {
    userController.getFriends(req, res);
});

router.delete("/user", (req, res) => {
    userController.deleteUserAccount(req, res);
})
export default router
