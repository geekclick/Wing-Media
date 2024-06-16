import mongoose from 'mongoose';

const commentModel = new mongoose.Schema({
    user: {
        username: String,
        avatar: {
            public_id: String,
            url: String,
        },
    },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const likeModel = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
});

const postImageModel = new mongoose.Schema({
    publicId: { type: String, required: true },
    url: { type: String, required: true }
})

const postModel = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    postImage: postImageModel,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    comments: [commentModel],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Post = mongoose.model('Post', postModel);
export default Post