import dotenv from "dotenv"
dotenv.config()

const corsOptions = {
    origin: [
        `${process.env.CLIENT_URL}`,
        "http://localhost:5173",
    ],
    methods: "POST, GET, DELETE, PUT",
    credentials: true,
};

const endpoints = [
    "/*",
    "/chats",
    "/chats/:id",
    "/calls",
    "/profile",
    "/user/:id",
    "/profile/edit",
    "/profile/following/:id",
    "/profile/followers/:id",
    "/user/following/:id",
    "/user/followers/:id",
    "/post/:id",
    "/discover",
    "/notifications",
    "/stories/:id",
    "/stories/new"
];

const STORY_DURATION = 24 * 60 * 60 * 1000;

export { corsOptions, STORY_DURATION, endpoints }