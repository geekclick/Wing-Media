import dotenv from "dotenv"
dotenv.config()

const corsOptions = {
    origin: [
        process.env.CLIENT_URL,
        "http://localhost:5173",
    ],
    methods: "POST, GET, DELETE, PUT",
    credentials: true,
};

const STORY_DURATION = 24 * 60 * 60 * 1000;

export { corsOptions, STORY_DURATION }