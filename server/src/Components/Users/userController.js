import { ALERT, NEW_REQUEST, REFETCH_CHATS } from "../../Constants/events.js";
import { createError, createResponse } from "../../Helpers/index.js";
import { TryCatch } from "../../Middlewares/errorMiddleware.js";
import { Chat } from "../../Models/chatModel.js";
import { Message } from "../../Models/messageModel.js";
import Post from "../../Models/postModel.js";
import { Request } from "../../Models/requestModel.js";
import { Story } from "../../Models/storyModel.js";
import User from "../../Models/userModel.js";
import { emitEvent, uploadFileToCloudinary } from "../../Utils/features.js";
import userServices from "./userServices.js";

class UserController {
    profile = TryCatch(async (req, res, next) => {
        const user = await userServices.getProfile(req.user)
        if (user) {
            return createResponse(res, 200, "Profile fetched!", user._doc, 200)
        } else {
            return createError(res, 404, "Profile not found")
        }
    })

    getUser = TryCatch(async (req, res, next) => {
        const userId = req.params.id
        if (userId) {
            const user = await User.findById(userId).select({ password: 0, isAdmin: 0, __v: 0 })
            if (user)
                return createResponse(res, 200, "User found!", user._doc, 200)
            else
                return createError(res, 404, "User not found")
        }
        return createError(res, 400, "User id is not valid")
    })

    updateProfile = TryCatch(async (req, res, next) => {
        const data = JSON.parse(req.body.data)
        const user = await User.findById(req.user)
        if (user) {
            let image = null;
            if (req.file) {
                try {
                    image = await uploadFileToCloudinary(req.file, '/wing/profile');
                } catch (uploadError) {
                    return createError(res, 500, "File upload failed: " + uploadError.message);
                }
                user.avatar = { publicId: image.public_id, url: image.secure_url }
            } else {
                user.avatar = data.avatar
            }


            user.name = data.name
            user.username = data.username
            user.email = data.email
            user.bio = data.bio

            await user.save()
            return createResponse(res, 200, "Profile updated!", user, 200)
        }
        return createError(res, 404, "User not found!")

    })

    searchUser = TryCatch(async (req, res, next) => {
        const query = req.query.q
        const users = await User.find({
            $or: [
                { name: new RegExp(query, 'i') },
                { username: new RegExp(query, 'i') }
            ]
        }).select({ password: 0, __v: 0 });
        if (users) {
            const formattedUsers = users.map((user) => user._doc);
            return createResponse(res, 200, `Users found for ${query}`, formattedUsers, 200)
        } else
            return createError(res, 404, "User not found!")
    })

    getNotifications = TryCatch(async (req, res, next) => {
        const requests = await Request.find({ receiver: req.user }).populate(
            "sender",
            "name avatar"
        );
        if (requests.length != 0) {
            const allRequests = requests.map(({ _id, sender }) => ({
                _id,
                sender: {
                    _id: sender._id,
                    name: sender.name,
                    avatar: sender.avatar.url,
                },
            }));
            return createResponse(res, 200, "New requests", allRequests, 200)
        } else
            return createResponse(res, 204, "No new requests!", 204)
    })

    getFriends = TryCatch(async (req, res, next) => {
        const chatId = req.query.chatId;
        console.log(chatId);
        const chats = await Chat.find({
            members: req.user,
            groupChat: false,
        }).populate("members", "name avatar");

        const user = await User.findById(req.user).populate("following", "_id name username avatar")


        const friends = user.following.map((user) => {

            return {
                _id: user._id,
                name: user.name,
                username: user.username,
                avatar: user.avatar
            };
        });

        if (chatId) {
            const chat = await Chat.findById(chatId);

            const availableFriends = friends.filter(
                (friend) => !chat.members.includes(friend._id)
            );

            return createResponse(res, 200, "Available Friends", availableFriends, 200)
        } else {
            return createResponse(res, 200, "Friends", friends, 200)
        }
    })

    sendFriendsRequest = TryCatch(async (req, res, next) => {
        const { userId } = req.body;

        const [sender, receiver] = await Promise.all([User.findById(req.user), User.findById(userId)]);

        if (!sender || !receiver) {
            return createError(res, 404, "Sender or Receiver not found");
        }

        const existingRequest = await Request.findOne({
            $or: [
                { sender: req.user, receiver: userId },
                { sender: userId, receiver: req.user }
            ]
        });


        console.log(existingRequest)
        const isFollowed = sender.following.some((id) => id == receiver._id)
        if (isFollowed) {
            return createResponse(res, 204, "Already Followed", 204)
        }

        const isOtherUserAlreadyFollowing = sender.followers.some((id) => id == userId)
        console.log(isOtherUserAlreadyFollowing)
        if (isOtherUserAlreadyFollowing) {
            const members = [sender._id, receiver._id];

            const chatExist = await Chat.findOne({ $or: [{ members: members }, { members: members.reverse() }] })
            if (!chatExist) {
                const chat = await Chat.create({
                    members,
                    name: `${sender.name}-${receiver.name}`,
                });
            }

            receiver.followers.push(sender);
            sender.following.push(receiver);

            await Promise.all([sender.save(), receiver.save()]);

            emitEvent(req, ALERT, [receiver._id], `${receiver.name} following you!`)

            await Request.deleteOne({ receiver: req.user })

            emitEvent(req, REFETCH_CHATS, members);
            return createResponse(res, 204, "Followed!", 204)
        }

        if (!existingRequest) {
            await Request.create({
                sender: req.user,
                receiver: userId
            });
            console.log("object")
            receiver.followers.push(sender);
            sender.following.push(receiver);

            await Promise.all([sender.save(), receiver.save()]);

            emitEvent(req, NEW_REQUEST, [userId], null);

            return createResponse(res, 204, "Request Sent!", 204);
        } else {
            return createResponse(res, 204, "Request Already Sent!", 204);
        }
    });

    acceptFriendRequest = TryCatch(async (req, res, next) => {
        const { requestId, accept } = req.body;

        const request = await Request.findById(requestId).populate("sender").populate("receiver");

        if (!request)
            return createError(res, 404, "Request not found!");

        if (request.receiver._id.toString() !== req.user.toString())
            return createError(res, 401, "You are not authorized to accept this request!");

        if (!accept) {
            await request.deleteOne();
            return createResponse(res, 204, "Request rejected!", 204);
        } else {
            const members = [request.sender._id, request.receiver._id];

            const chatExist = await Chat.findOne({ $or: [{ members: members }, { members: members.reverse() }] })
            if (!chatExist) {
                const chat = await Chat.create({
                    members,
                    name: `${request.sender.name}-${request.receiver.name}`,
                });
            }

            request.receiver.following.push(request.sender);
            request.sender.followers.push(request.receiver);

            await Promise.all([request.sender.save(), request.receiver.save()]);

            emitEvent(req, ALERT, [request.sender._id], `${request.receiver.name} accepted your friend request`)

            await request.deleteOne();

            emitEvent(req, REFETCH_CHATS, members);

            return createResponse(res, 200, "Follow request accepted!", request.sender._id, 200);
        }
    });

    deleteUserAccount = TryCatch(async (req, res, next) => {
        const id = req.body.data;
        await Promise.all([
            User.findByIdAndDelete(id),
            Post.deleteMany({ user_id: id }),
            Story.deleteMany({ user_id: id }),
            Chat.deleteMany({ members: id }),
            Request.deleteMany({ $or: [{ sender: id }, { receiver: id }] })
        ]);

        const userChats = await Chat.find({ members: id });
        const chatIds = userChats.map(chat => chat._id);

        await Message.deleteMany({ chat: { $in: chatIds } });

        createResponse(res, 200, "User account deleted successfully", null, 200)
    });
}

const userController = new UserController()
export default userController