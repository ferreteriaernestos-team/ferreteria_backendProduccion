import { ERROR_MESSAGES, LOG_MESSAGES } from "../constants";

export const authorizeRole = (allowedRoles: number[]) => {
  return (req: any, res: any, next: any) => {
    const user = req.user;

    console.log(LOG_MESSAGES.USER_FROM_TOKEN, user);
    console.log(LOG_MESSAGES.USER_ROLE, user?.rol_id);
    console.log(LOG_MESSAGES.ALLOWED_ROLES, allowedRoles);

    if (!user) {
      return res.status(401).json({ message: ERROR_MESSAGES.USER_NOT_AUTHENTICATED });
    }

    const userRole = Number(user.rol_id);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS,
      });
    }

    next();
  };
};