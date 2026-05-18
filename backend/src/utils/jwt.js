const { CONFIG } = require("../config/index")
const jsonwebtoken = require("jsonwebtoken");

const getJwtOptions = (expiresIn) => {
    if (!CONFIG.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    const options = {
        expiresIn: expiresIn || "15m",
    };

    if (CONFIG.FRONTEND_DOMAIN_COOKIE) {
        options.issuer = CONFIG.FRONTEND_DOMAIN_COOKIE;
    }

    return options;
};

exports.generateAccessToken = (payload) => {
    const token = jsonwebtoken.sign(payload, CONFIG.JWT_SECRET, getJwtOptions(CONFIG.JWT_EXPIRY));
    return token;
};

exports.generateRefreshToken = (payload) => {
    const token = jsonwebtoken.sign(payload, CONFIG.JWT_SECRET, getJwtOptions(CONFIG.JWT_EXPIRY_REFRESH || "30d"));
    return token;
};

exports.verifyToken = (token) => {
    if (!CONFIG.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    const options = CONFIG.FRONTEND_DOMAIN_COOKIE
        ? { issuer: CONFIG.FRONTEND_DOMAIN_COOKIE }
        : {};
    const decodedToken = jsonwebtoken.verify(token, CONFIG.JWT_SECRET, options);
    return decodedToken;
};
