"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: constants_1.ERROR_MESSAGES.TOKEN_REQUIRED });
    }
    if (!authHeader.startsWith(constants_1.FORMATS.BEARER_PREFIX)) {
        return res.status(401).json({ message: constants_1.ERROR_MESSAGES.INVALID_TOKEN_FORMAT });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: constants_1.ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN });
    }
};
exports.authMiddleware = authMiddleware;
