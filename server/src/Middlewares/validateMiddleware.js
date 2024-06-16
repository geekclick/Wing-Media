export const validate = (schema) => async (req, res, next) => {
    try {
        const pasreBody = await schema.parseAsync(req.body);
        req.body = pasreBody;
        next();
    } catch (err) {
        // const message = err.errors[0].message;
        // console.log(message);
        // res.status(400).send({msg:message})

        const status = 422;
        const message = "Fill the Input properly"
        const extraDetails = err.errors[0].message;

        const error = {
            status,
            message,
            extraDetails
        }

        console.log(error);
        next(error);

    }
}