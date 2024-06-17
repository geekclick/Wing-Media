import { createResponse, createError, decodeToken } from "../../Helpers/index.js"
import { TryCatch } from "../../Middlewares/errorMiddleware.js";
import authServices from "./authServices.js"

class AuthController {

    register = TryCatch(async (req, res, next) => {
        const user = await authServices.addNewUser(req, res);
        if (user) {
            createResponse(res, 201, "New user created successfully!", user, 201);
        } else {
            createError(res, 404, "Unable to create new user!");
        }
    })

    login = TryCatch(async (req, res, next) => {
        const { email, password } = req.body;
        const user = await authServices.validateUser(email, password);
        if (user) {
            createResponse(res, 200, "Login successful!", user, 200);
        } else {
            createError(res, 401, "Invalid credentials!");
        }
    })

    logout = TryCatch(async (req, res, next) => {
        createResponse(res, 204, "Log out successfull", 204)
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
