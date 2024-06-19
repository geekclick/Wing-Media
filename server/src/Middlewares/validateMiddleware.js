export const validate = (schema) => async (req, res, next) => {
    try {
        const pasreBody = await schema.parseAsync(req.body);
        req.body = pasreBody;
        next();
    } catch (err) {
        const message = err.errors[0].message;
        const path = err.errors[0].path[0];
        res.status(401).send({ path: path, message: message })
    }
}