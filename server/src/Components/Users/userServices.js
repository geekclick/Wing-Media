import User from "../../Models/userModel.js";

class UserServices {
    async getProfile(id) {
        const user = await User.findById(id);
        if (user) {
            return user.toJSON();
        } else return null
    }
}

const userServices = new UserServices()
export default userServices