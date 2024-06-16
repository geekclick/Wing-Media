import { cookieOptions } from "../../Constants/config.js";
import { createResponse, createError, decodeToken } from "../../Helpers/index.js"
import authServices from "./authServices.js"

class AuthController {

    async register(req, res) {
        try {
            const user = await authServices.addNewUser(req, res);
            if (user) {
                res.cookie('token', user.token, cookieOptions);
                createResponse(res, 200, "New user created successfully!", user, 200);
            } else {
                createError(res, 400, "Unable to create new user!");
            }
        } catch (error) {
            createError(res, 400, error.message);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await authServices.validateUser(email, password);
            if (user) {
                res.cookie('token', user.token, cookieOptions);
                createResponse(res, 200, "Login successful!", user, 200);
            } else {
                createError(res, 400, "Invalid credentials!");
            }
        } catch (error) {
            createError(res, 400, error.message);
        }
    }

    async logout(req, res) {
        try {
            res.cookie("token", "", { ...cookieOptions, maxAge: 0 })
            createResponse(res, 200, "Log out successfull", 200)
        } catch (error) {
            createError(res, 400, error.message)
        }
    }

    async isAuthorized(req, res) {
        try {
            const token = decodeToken(req)
            if (token) {
                const user = await authServices.isUserExists(token)
                if (user) {
                    return createResponse(res, 200, "Authorized!", user, 200)
                }
            } return createError(res, 400, "Unauthorized!")
        } catch (error) {
            return createError(res, 400, error.message)
        }
    }

}

const authController = new AuthController();
export default authController
