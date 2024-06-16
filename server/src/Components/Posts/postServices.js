import Post from "../../Models/postModel.js";
import User from "../../Models/userModel.js";

class AuthServices {
    async addPost(payload) {
        try {
            const user = await User.findById(payload._id)
            if (user) {
                const post = await new Post({ content: payload.content, user_id: payload._id, postImage: payload.image })
                if (post) {
                    user.posts.push(post)
                    await user.save()
                    await post.save()
                    return post
                } else {
                    return null
                }
            } else return null
        } catch (error) {
            return error
        }
    }

    async getAllPosts(payload) {
        const user = await User.findById(payload._id)
        if (user) {
            const posts = await Post.find()
            if (posts) {
                return posts
            } return null
        } return null
    }
}

const postServices = new AuthServices();
export default postServices