const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET;
const asyncHandler = require('express-async-handler');

const auth = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("No user Found");
        res.json({ message: "Invalid Credentials" });
    }
    else {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }
})
module.exports = auth;