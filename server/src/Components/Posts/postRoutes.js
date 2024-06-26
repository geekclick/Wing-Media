import express from "express";
import postController from "./postController.js";
import { singleImage } from "../../Middlewares/multerMiddleware.js";
import authorized from "../../Middlewares/authMiddleware.js";

const router = express.Router();
router.use(authorized)
// get all posts
router.get("/", (req, res) => {
    postController.getPosts(req, res);
});

// add new post
router.post("/", singleImage, (req, res) => {
    postController.newPost(req, res);
});

// get post by id
// update post by id

// delete post by id
router.delete("/post/:id", (req, res) => {
    postController.deletePost(req, res);
});

// add like to post
router.post("/post/like", (req, res) => {
    postController.addLike(req, res);
});

// remove like from post
router.post("/post/unlike", (req, res) => {
    postController.removeLike(req, res);
});

// add comment
router.post("/comment/:id", (req, res) => {
    postController.addComment(req, res);
});

// delete comment
router.delete("/comment/:id", (req, res) => {
    postController.deleteComment(req, res);
});



export default router;
