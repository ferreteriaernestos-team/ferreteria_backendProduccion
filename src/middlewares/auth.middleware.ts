import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES, FORMATS } from "../constants";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: ERROR_MESSAGES.TOKEN_REQUIRED });
  }

  if (!authHeader.startsWith(FORMATS.BEARER_PREFIX)) {
    return res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN_FORMAT });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN });
  }
};