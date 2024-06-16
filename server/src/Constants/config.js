import dotenv from "dotenv"
dotenv.config()

const corsOptions = {
    origin: [
        process.env.CLIENT_URL,
        'https://wing-media.vercel.app',
        "http://localhost:5173",
        "http://localhost:5000",
    ],
    methods: "POST, GET, DELETE, PUT",
    credentials: true,
};

const cookieOptions = {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};

const STORY_DURATION = 24 * 60 * 60 * 1000;

export { corsOptions, cookieOptions, STORY_DURATION }