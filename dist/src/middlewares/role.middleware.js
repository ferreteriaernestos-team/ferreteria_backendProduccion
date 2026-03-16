"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const constants_1 = require("../constants");
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        console.log(constants_1.LOG_MESSAGES.USER_FROM_TOKEN, user);
        console.log(constants_1.LOG_MESSAGES.USER_ROLE, user?.rol_id);
        console.log(constants_1.LOG_MESSAGES.ALLOWED_ROLES, allowedRoles);
        if (!user) {
            return res.status(401).json({ message: constants_1.ERROR_MESSAGES.USER_NOT_AUTHENTICATED });
        }
        const userRole = Number(user.rol_id);
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: constants_1.ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS,
            });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
