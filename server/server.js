import express from 'express';
import { Server } from 'socket.io';
import http from 'http'
import cors from "cors"
import { errorMiddleware } from "./src/Middlewares/errorMiddleware.js"
import { connectDB } from "./src/DB/db.js"
import routes from './src/Routes/index.js';
import dotenv from "dotenv"
import morgan from "morgan"
import { decodeJwt, getSockets } from './src/Helpers/index.js';
import { corsOptions } from "./src/Constants/config.js"
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, ONLINE_USERS, START_TYPING, STOP_TYPING } from './src/Constants/events.js';
import { Message } from './src/Models/messageModel.js';
import { v4 as uuid } from "uuid"
import { v2 as cloudinary } from 'cloudinary'
import User from './src/Models/userModel.js';
import { Request } from './src/Models/requestModel.js';
import { Chat } from './src/Models/chatModel.js';
import authorized from './src/Middlewares/authMiddleware.js';
dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });
const port = process.env.PORT;
const userSocketIDs = new Map();
const onlineUsers = new Set();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.set("io", io);

app.use(cors(corsOptions))
app.use(express.json());
app.use(morgan('dev')) // for logging http request to console
app.use(errorMiddleware);
routes(app);

io.use((socket, next) => {
    const token = socket.handshake.headers.authorization.split(' ')[1];
    if (token) {
        socket.user = decodeJwt(token)
        next()
    } else {
        next(new Error('Authentication error'));
    }
});


io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user._id}`)
    const user = socket.user;
    userSocketIDs.set(user._id.toString(), socket.id);

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
        };

        const membersSocket = getSockets(members);
        io.to(membersSocket).emit("NEW_MESSAGE", {
            chatId,
            message: messageForRealTime,
        });
        io.to(membersSocket).emit("NEW_MESSAGE_ALERT", { chatId });
        io.to(membersSocket).emit("REFETCH_MESSAGES");
        try {
            await Message.create(messageForDB);
        } catch (error) {
            throw new Error(error);
        }
    });

    socket.on("UNFOLLOW_USER", async ({ userA, userB }) => {
        const [user1, user2] = await Promise.all([User.findById(userA), User.findById(userB)]);
        try {
            if (user) {
                const newFollowing = user1.following.filter((uid) => uid != userB)
                const newFollowers = user2.followers.filter((uid) => uid != userA)
                user1.following = newFollowing
                user2.followers = newFollowers
                await user1.save()
                await user2.save()

                const request = await Request.findOne({ sender: userA })
                if (request)
                    await Request.findOneAndDelete(request._id)

                console.log("Unfollowed!")
            }
        } catch (error) {
            throw new Error(error)
        }
    })

    socket.on("INCREMENT_MESSAGE_COUNT", async ({ chatId }) => {
        const chat = await Chat.findById(chatId)
        if (chat) {
            chat.messageCount += 1
            chat.save()
        } else {
            console.log("Chat not found!")
        }
    });

    socket.on(START_TYPING, ({ members, chatId }) => {
        const membersSockets = getSockets(members);
        socket.to(membersSockets).emit(START_TYPING, { chatId });
    });

    socket.on(STOP_TYPING, ({ members, chatId }) => {
        const membersSockets = getSockets(members);
        socket.to(membersSockets).emit(STOP_TYPING, { chatId });
    });

    socket.on(CHAT_JOINED, ({ userId, members }) => {
        onlineUsers.add(userId.toString());

        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on(CHAT_LEAVED, ({ userId, members }) => {
        onlineUsers.delete(userId.toString());

        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
        userSocketIDs.delete(user._id.toString());
        onlineUsers.delete(user._id.toString());
        socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
    });
});


app.get('/', (req, res) => {
    res.send("Home endpoint")
})

connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is running...`);
    });
});

export default userSocketIDs

// createUser(3)
// createSingleChats(3)