import { REFETCH_STORIES } from "../../Constants/events.js";
import { createError, createResponse } from "../../Helpers/index.js";
import { TryCatch } from "../../Middlewares/errorMiddleware.js";
import { Story } from "../../Models/storyModel.js";
import { deleteFileFromCloudinary, emitEvent, uploadFileToCloudinary } from "../../Utils/features.js";

class StoryController {
    getStories = TryCatch(async (req, res, next) => {
        const stories = await Story.find()
        if (stories)
            return createResponse(res, 200, "Stories found", stories, 200)
        else
            return createError(res, 404, "Stories not found")
    })

    addStory = TryCatch(async (req, res, next) => {
        const storyUrl = await uploadFileToCloudinary(req.file, "/wing/story")
        const story = await new Story({ story: { publicId: storyUrl.public_id, url: storyUrl.secure_url }, user_id: req.user, ...req.body })
        if (story) {
            await story.save()
            emitEvent(req, REFETCH_STORIES);
            return createResponse(res, 201, "Story added", story, 201)
        } else
            return createError(res, 404, "unable to add story")
    })

    deleteStory = TryCatch(async (req, res, next) => {
        const { id } = req.params
        const story = await Story.findById(id)
        if (story) {
            await deleteFileFromCloudinary(story.story.publicId)
            await Story.findByIdAndDelete(id)
            emitEvent(req, REFETCH_STORIES);
            return createResponse(res, 200, "Story removed", 200)
        } else
            return createError(res, 404, "Story not found")
    })
}

const storyController = new StoryController()
export default storyController