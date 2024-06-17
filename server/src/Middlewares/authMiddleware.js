import { createError, decodeToken } from "../Helpers/index.js";
import { TryCatch } from "./errorMiddleware.js";

const authorized = TryCatch((req, res, next) => {
    const token = decodeToken(req);
    if (!token)
        createError(res, 401, "Unauthorized: Please login to access this route")
    else req.user = token._id;

    next();
});

export default authorized;