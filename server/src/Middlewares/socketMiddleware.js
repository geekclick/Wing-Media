import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { decodeToken } from '../Helpers';

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = decodeToken(req)

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        req.user = token._id;
        console.log(req.user)
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default verifyToken;
