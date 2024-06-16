import express from "express"
import storyController from "./storiesController.js";
import { singleImage } from "../../Middlewares/multerMiddleware.js";
const router = express.Router();

router.get("/", (req, res) => {
    storyController.getStories(req, res)
});

router.post("/", singleImage, (req, res) => {
    storyController.addStory(req, res)
});

router.delete("/:id", (req, res) => {
    storyController.deleteStory(req, res)
})

// router.get("/:id", (req, res) => {
// get story by id
// })




export default router
