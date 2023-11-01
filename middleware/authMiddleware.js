// middleware/auth.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    console.log("Entering authMiddleware");
    const token = req.header('x-auth-token');
    if (!token) {
        console.log("No token found");
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        console.log("Attempting to verify token");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log("Token verified. Moving to next middleware or route.");
        next();
    } catch (err) {
        console.log("Token verification failed:", err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
}


export default authMiddleware;
