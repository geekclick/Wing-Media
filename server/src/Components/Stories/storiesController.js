import { createError, createResponse, decodeToken } from "../../Helpers/index.js";
import { Story } from "../../Models/storyModel.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../Utils/features.js";

class StorisController {

    async getStories(req, res) {
        const token = decodeToken(req)
        if (token) {
            const stories = await Story.find()
            if (stories)
                return createResponse(res, 200, "Stories found", stories, 200)
            else
                return createError(res, 400, "Stories not found")
        }
        return createError(res, 400, "unauthorized")
    }

    async addStory(req, res) {
        const token = decodeToken(req)
        if (token) {
            const storyUrl = await uploadFileToCloudinary(req.file, "/wing/story")
            const story = await new Story({ story: { publicId: storyUrl.public_id, url: storyUrl.secure_url }, user_id: token._id, ...req.body })
            if (story) {
                await story.save()
                createResponse(res, 200, "Story added", story, 200)
            } else
                createError(res, 400, "unable to add story")
        } else
            createError(res, 400, "uauthorized")
    }

    async deleteStory(req, res) {
        const token = decodeToken(req)
        const { id } = req.params
        if (token) {
            const story = await Story.findById(id)
            if (story) {
                await deleteFileFromCloudinary(story.story.publicId)
                await Story.findByIdAndDelete(id)
                createResponse(res, 200, "Story removed", null, 200)
            } else
                createError(res, 400, "story not found")
        } else
            createError(res, 400, "uauthorized")
    }
}

const storyController = new StorisController()
export default storyController