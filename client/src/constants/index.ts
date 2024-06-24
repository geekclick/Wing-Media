import { v4 as uuid } from "uuid";

const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;
const POST_URL = `${import.meta.env.VITE_SERVER_URL}/post/`;

const TEST_USER = {
  username: `testuser_e${uuid().toString().slice(0, 4)}`,
  name: "Test User",
  email: `testuser@${uuid().toString().slice(0, 4)}.com`,
  password: `testpassword${uuid().toString().slice(0, 4)}`,
  isGuest: true,
};

export { SERVER_URL, POST_URL, TEST_USER };
