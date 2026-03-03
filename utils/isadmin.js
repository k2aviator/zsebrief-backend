const jwt = require('jsonwebtoken');

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // console.log("Authorization header:", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send("Token missing");
        }

        // 👇 THIS is the important line
        const token = authHeader.split(' ')[1];

        // console.log("Token being verified:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log("JWT_SECRET:", process.env.JWT_SECRET);
        // console.log("Decoded token:", decoded);
        if (!decoded.roles || !decoded.roles.includes('admin')) {
            return res.status(403).send("Not authorized");
        }

        req.user = decoded;
        return next();

    } catch (err) {
        console.log("JWT verify error:", err.message);
        return res.status(401).send("Invalid token");
    }
};

module.exports = isAdmin;