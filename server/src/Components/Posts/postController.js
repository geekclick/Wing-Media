import { REFETCH_POSTS } from "../../Constants/events.js";
import { createError, createResponse } from "../../Helpers/index.js"
import { TryCatch } from "../../Middlewares/errorMiddleware.js";
import Post from "../../Models/postModel.js"
import User from "../../Models/userModel.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../Utils/features.js"
import postServices from "./postServices.js"

class PostController {

    newPost = TryCatch(async (req, res, next) => {
        let image = null;
        if (req.file) {
            try {
                image = await uploadFileToCloudinary(req.file);
            } catch (uploadError) {
                return createError(res, 500, "File upload failed: " + uploadError.message);
            }
            image = { publicId: image.public_id, url: image.secure_url }
        }
        const _id = req.user;
        const postData = { _id, ...req.body, image };
        const post = await postServices.addPost({ ...postData });
        if (!post) {
            return createError(res, 400, "Unable to create post");
        }

        return createResponse(res, 201, "Post created successfully", post, 201);
    })

    getPosts = TryCatch(async (req, res, next) => {
        const posts = await postServices.getAllPosts({ _id: req.user })
        if (posts) {
            return createResponse(res, 200, "Got posts successfully", posts, 200)
        } else {
            return createError(res, 404, "Posts not found")
        }
    })

    addLike = TryCatch(async (req, res, next) => {
        const { postId } = req.body
        const io = req.app.get("io")
        const post = await Post.findById(postId)
        if (post) {
            post.likes.push(req.user)
            await post.save()
            io.emit(REFETCH_POSTS)
            return createResponse(res, 200, "Post liked!", 200)
        } else {
            return createError(res, 404, "Post not found")
        }
    })

    removeLike = TryCatch(async (req, res, next) => {
        const { postId } = req.body
        const io = req.app.get("io")
        const post = await Post.findById(postId)
        if (post) {
            const newLikes = post.likes.filter((user) => user != req.user)
            post.likes = newLikes
            await post.save()
            io.emit(REFETCH_POSTS)
            return createResponse(res, 200, "Post unliked!", 200)
        } else {
            return createError(res, 404, "Post not found")
        }
    })

    deletePost = TryCatch(async (req, res, next) => {
        const { id } = req.params;
        const [post, user] = await Promise.all([Post.findById(id), User.findById(req.user)]);
        if (post) {
            // Delete the post from posts schema
            if (post.postImage) {
                if (post.postImage.url.endsWith(4))
                    await deleteFileFromCloudinary(post.postImage.publicId, "video")
                else
                    await deleteFileFromCloudinary(post.postImage.publicId)
            }
            //Delete the post from user schema
            const newUserPosts = user.posts.filter((postId) => postId != id)
            user.posts = newUserPosts
            user.save()
            await Post.findByIdAndDelete(id)
            return createResponse(res, 200, "Post deleted!", 200);
        } else {
            return createError(res, 404, "Post not found.");
        }
    })


    addComment = TryCatch(async (req, res, next) => {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (post) {
            post.comments.push(req.body)
            await post.save()
            return createResponse(res, 201, "Comment added", { ...req.body }, 201);
        } else {
            return createError(res, 404, "Post not found.");
        }
    })

    deleteComment = TryCatch(async (req, res, next) => {
        const { id } = req.params;
        const { comment_id } = req.body
        const post = await Post.findById(id);
        if (post) {
            const newComments = post.comments.filter((c) => c._id != comment_id)
            post.comments = newComments
            await post.save()
            return createResponse(res, 200, "Comment Deleted", 200);
        } else {
            return createError(res, 404, "Post not found.");
        }
    })
}

const postController = new PostController()
export default postController;