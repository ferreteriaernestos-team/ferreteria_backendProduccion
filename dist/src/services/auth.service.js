"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const jwt_1 = require("../utils/jwt");
const constants_1 = require("../constants");
const registerUser = async (data) => {
    const existingUser = await prisma_1.prisma.usuarios.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error(constants_1.ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, constants_1.DEFAULTS.BCRYPT_SALT_ROUNDS);
    const user = await prisma_1.prisma.usuarios.create({
        data: {
            nombre: data.nombre,
            email: data.email,
            password: hashedPassword,
            rol_id: data.rol_id,
        },
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.prisma.usuarios.findUnique({
        where: { email },
    });
    if (!user)
        throw new Error(constants_1.ERROR_MESSAGES.USER_NOT_FOUND);
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        throw new Error(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
    const token = (0, jwt_1.generateToken)({
        id: user.id,
        rol_id: user.rol_id,
    });
    return { token };
};
exports.loginUser = loginUser;
