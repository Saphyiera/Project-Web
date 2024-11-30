import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const jwt_secret = process.env.JWT_SECRET;

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({errors: "Please authenticate using a valid token"});
    } else {
        try {
            const data = jwt.verify(token, jwt_secret);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors: "Please authenticate using a valid token"})
        }
    }
}

export { fetchUser };