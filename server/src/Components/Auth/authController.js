import { createResponse, createError, decodeToken } from "../../Helpers/index.js"
import { TryCatch } from "../../Middlewares/errorMiddleware.js";
import authServices from "./authServices.js"

class AuthController {

    register = TryCatch(async (req, res, next) => {
        const user = await authServices.addNewUser(req, res);
        console.log(user)
        if (user) {
            return createResponse(res, 201, "New user created successfully!", user, 201);
        } else {
            return createError(res, 404, "Unable to create new user!");
        }
    })

    login = TryCatch(async (req, res, next) => {
        const { email, password } = req.body;
        const user = await authServices.validateUser(email, password);
        if (user._id) {
            return createResponse(res, 200, "Login successful!", user, 200);
        } else {
            return createError(res, 401, user.message);
        }
    })

    logout = TryCatch(async (req, res, next) => {
        return createResponse(res, 200, "Log out successfull", 200)
    })

    isAuthorized = TryCatch(async (req, res, next) => {
        const token = decodeToken(req)
        if (token) {
            const user = await authServices.isUserExists(token)
            if (user) {
                return createResponse(res, 200, "Authorized!", user, 200)
            }
        } return createError(res, 401, "Unauthorized!")
    })

}

const authController = new AuthController();
export default authController
