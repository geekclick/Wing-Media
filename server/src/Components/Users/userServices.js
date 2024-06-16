import User from "../../Models/userModel.js";

class UserServices {
    async getProfile(id) {
        const user = await User.findById(id).select({ password: 0, isAdmin: 0, __v: 0 })
        if (user) {
            return user
        } else return null
    }
}

const userServices = new UserServices()
export default userServices