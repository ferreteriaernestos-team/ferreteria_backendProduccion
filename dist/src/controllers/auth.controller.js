"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        const registerData = req.body;
        const user = await (0, auth_service_1.registerUser)(registerData);
        const userResponse = {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol_id: user.rol_id,
        };
        res.status(201).json(userResponse);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const loginData = req.body;
        const result = await (0, auth_service_1.loginUser)(loginData.email, loginData.password);
        const authResponse = {
            token: result.token,
        };
        res.json(authResponse);
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.login = login;
