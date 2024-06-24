import express from "express"
import authController from "./authController.js"
import { validate } from "../../Middlewares/validateMiddleware.js"
import { loginSchema, registerSchema } from "./inputValidator.js"

const router = express.Router();

router.post("/login", validate(loginSchema), (req, res) => {
    authController.login(req, res);
});

router.post("/register", validate(registerSchema), (req, res) => {
    authController.register(req, res);
});

router.get("/logout", (req, res) => {
    authController.logout(req, res);
});

router.get("/authenticate", (req, res) => {
    authController.isAuthorized(req, res);
});

router.get("/guests", (req, res) => {
    authController.getGuests(req, res)
})

export default router
