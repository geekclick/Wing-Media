import { faker } from "@faker-js/faker";
import { Chat } from "../Models/chatModel.js";
import User from "../Models/userModel.js";

const createSingleChats = async (numChats) => {
    try {
        const users = await User.find().select("_id");

        const chatsPromise = [];

        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                chatsPromise.push(
                    Chat.create({
                        name: faker.lorem.words(2),
                        members: [users[i], users[j]],
                    })
                );
            }
        }

        await Promise.all(chatsPromise);

        console.log("Chats created successfully");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
export { createSingleChats }