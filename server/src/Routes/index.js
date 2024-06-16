import authRoutes from "../Components/Auth/authRoutes.js";
import postRoutes from "../Components/Posts/postRoutes.js"
import userRoutes from "../Components/Users/userRoutes.js"
import chatRoutes from "../Components/Chats/chatRoutes.js"
import storyRoutes from "../Components/Stories/storiesRoutes.js"

export default (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/chats", chatRoutes);
    app.use("/api/stories", storyRoutes);
};
