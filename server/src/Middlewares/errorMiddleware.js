const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "BACKEND ERROR";
    const extraDetails = err.extraDetails || "Error from Backend";

    return res.status(status).json({ message, extraDetails });
};

const TryCatch = (passedFunc) => async (req, res, next) => {
    try {
        await passedFunc(req, res, next);
    } catch (error) {
        if (!(error instanceof Error)) {
            const newError = new Error("Unknown error");
            newError.status = 500;
            next(newError);
        } else {
            console.log(error)
        }
    }
};
export { errorMiddleware, TryCatch };