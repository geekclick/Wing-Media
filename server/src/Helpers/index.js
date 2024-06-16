import userSocketIDs from "../../server.js";

export const createValidationResponse = (res, errors) => {
    return res.status(400).json({
        status: 400,
        message: errors[Object.keys(errors)?.[0]],
        errors: { ...errors },
    });
};

export const createResponse = (res, status, message, data, statusCode) => {
    return res.status(status).json({ status: statusCode, message, data });
};

export const createError = (res, status, message) => {
    return res.status(status).json({ message, status });
};

export const decodeJwt = (token) => {
    if (!token) return null;
    const payload = token.split(".")[1];
    if (!payload) return null;

    // Replace Base64URL characters with Base64 characters
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    const padding = '='.repeat((4 - base64.length % 4) % 4);

    const base64WithPadding = base64 + padding;
    const decodedPayload = atob(base64WithPadding);
    return JSON.parse(decodedPayload);
};


export const decodeToken = (req) => {
    const token = req.cookies.token;
    if (token) return decodeJwt(token);
    else return null;
};

export const getOtherMember = (members, userId) =>
    members.find((member) => member._id.toString() !== userId.toString());

export const getSockets = (users = []) => {
    const sockets = users.map((user) => userSocketIDs.get(user.toString()));

    return sockets;
};

export const getBase64 = (file) =>
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;