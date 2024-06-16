import mongoose, { Schema, model, Types } from "mongoose";
import { STORY_DURATION } from "../Constants/config.js";

const storyImageModel = new Schema({
    publicId: { type: String, required: true },
    url: { type: String, required: true }
});

const storyModel = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
        },
        story: {
            type: storyImageModel, required: true
        },
        caption: {
            type: String
        },
        expirationDate: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

// middleware to set the expirationDate 24 hours after createdAt
storyModel.pre('save', function (next) {
    if (this.isNew) {
        this.expirationDate = new Date(this.createdAt.getTime() + STORY_DURATION);
    }
    next();
});

export const Story = mongoose.models.Story || model("Story", storyModel);
