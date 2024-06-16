import { createError, createResponse, decodeToken } from "../../Helpers/index.js"
import Post from "../../Models/postModel.js"
import User from "../../Models/userModel.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../Utils/features.js"
import postServices from "./postServices.js"

class PostController {
    async newPost(req, res) {
        try {
            const { _id } = decodeToken(req);
            if (!_id) {
                return createError(res, 400, "Unauthorized user!");
            }

            let image = null;
            if (req.file) {
                try {
                    image = await uploadFileToCloudinary(req.file);
                } catch (uploadError) {
                    return createError(res, 500, "File upload failed: " + uploadError.message);
                }
                image = { publicId: image.public_id, url: image.secure_url }
            }

            const postData = { _id, ...req.body, image };
            const post = await postServices.addPost({ ...postData });
            if (!post) {
                return createError(res, 400, "Unable to create post");
            }

            return createResponse(res, 200, "Post created successfully", post, 200);
        } catch (error) {
            console.error('Error creating post:', error);
            return createError(res, 500, "An error occurred while creating the post: " + error.message);
        }
    }

    async getPosts(req, res) {
        try {
            const { _id } = decodeToken(req)
            if (_id) {
                const posts = await postServices.getAllPosts({ _id })
                if (posts) {
                    createResponse(res, 200, "Got posts successfully", posts, 200)
                } else {
                    createError(res, 400, "Unable to get post")
                }
            } else {
                createError(res, 400, "Unauthorized user!")
            }
        } catch (error) {
            createError(res, 400, error.message)
        }
    }

    async addLike(req, res) {
        try {
            const { _id } = decodeToken(req)
            const { postId } = req.body
            const io = req.app.get("io")
            if (_id) {
                const post = await Post.findById(postId)
                if (post) {
                    post.likes.push(_id)
                    await post.save()
                    io.emit("REFETCH_POSTS")
                    createResponse(res, 200, "Post liked!", 200)
                } else {
                    createError(res, 400, "Unable to get post")
                }
            } else {
                createError(res, 400, "Unauthorized user!")
            }
        } catch (error) {
            createError(res, 400, error.message)
        }
    }

    async removeLike(req, res) {
        try {
            const { _id } = decodeToken(req)
            const { postId } = req.body
            const io = req.app.get("io")
            if (_id) {
                const post = await Post.findById(postId)
                if (post) {
                    const newLikes = post.likes.filter((user) => user != _id)
                    post.likes = newLikes
                    await post.save()
                    io.emit("REFETCH_POSTS")
                    createResponse(res, 200, "Post unliked!", 200)
                } else {
                    createError(res, 400, "Unable to get post")
                }
            } else {
                createError(res, 400, "Unauthorized user!")
            }
        } catch (error) {
            createError(res, 400, error.message)
        }
    }

    async deletePost(req, res) {
        const { _id } = decodeToken(req);
        const { id } = req.params;
        try {
            if (_id) {
                const [post, user] = await Promise.all([Post.findById(id), User.findById(_id)]);
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
                    createResponse(res, 200, "Post deleted!");
                } else {
                    createError(res, 404, "Post not found.");
                }
            } else {
                createError(res, 401, "Unauthorized");
            }
        } catch (error) {
            createError(res, 500, error.message);
        }
    }


    async addComment(req, res) {
        const { _id } = decodeToken(req);
        const { id } = req.params;
        try {
            if (_id) {
                const post = await Post.findById(id);
                if (post) {
                    post.comments.push(req.body)
                    await post.save()
                    createResponse(res, 200, "Comment added", { ...req.body }, 200);
                } else {
                    createError(res, 404, "Post not found.");
                }
            } else {
                createError(res, 401, "Unauthorized");
            }
        } catch (error) {
            createError(res, 500, error.message);
        }
    }

    async deleteComment(req, res) {
        const { _id } = decodeToken(req);
        const { id } = req.params;
        const { comment_id } = req.body
        try {
            if (_id) {
                const post = await Post.findById(id);
                if (post) {
                    const newComments = post.comments.filter((c) => c._id != comment_id)
                    post.comments = newComments
                    await post.save()
                    createResponse(res, 200, "Comment Deleted", null, 200);
                } else {
                    createError(res, 404, "Post not found.");
                }
            } else {
                createError(res, 401, "Unauthorized");
            }
        } catch (error) {
            createError(res, 500, error.message);
        }
    }




}

const postController = new PostController();
export default postController