import { createError, decodeToken } from "../Helpers/index.js";
import { TryCatch } from "./errorMiddleware.js";

const isAuthenticated = TryCatch((req, res, next) => {
    const token = decodeToken(req);
    if (!token)
        createError(res, 400, "Please login to access this route")
    else req.user = token._id;

    next();
});

export { isAuthenticated }