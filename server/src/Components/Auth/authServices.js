import User from "../../Models/userModel.js";

class AuthService {

    async validateUser(email, password) {
        const user = await User.findOne({ email: email });
        if (user) {
            const isAuthorizedUser = await user.authenticateUser(password)
            if (isAuthorizedUser) return user.toAuthJSON()
        } else return null
    }

    async addNewUser(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                let { username, email } = req.body
                email = String(email).toLowerCase()
                const user = await User.findOne({ email: email })
                const usernameExist = await User.findOne({ username: username })
                if (user) {
                    reject({ message: "That email is already in use!" })
                } if (usernameExist) {
                    reject({ message: "That username is already in use!" })
                } else {
                    const new_user = new User(req.body)
                    await new_user.save()
                    if (new_user) {
                        resolve(new_user.toAuthJSON())
                    } else {
                        await new_user.remove();
                        reject({ message: "Unable to create a new user!" })
                    }
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    async isUserExists(payload) {
        try {
            const user = await User.findById(payload._id)
            if (user) {
                return user;
            }
        } catch (error) {
            return error
        }
    }

}

const authService = new AuthService()
export default authService