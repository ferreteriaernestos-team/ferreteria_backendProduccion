"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: constants_1.DEFAULTS.JWT_EXPIRATION,
    });
};
exports.generateToken = generateToken;
