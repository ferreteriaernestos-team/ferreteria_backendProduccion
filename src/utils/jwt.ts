import jwt from "jsonwebtoken";
import { DEFAULTS } from "../constants";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: DEFAULTS.JWT_EXPIRATION,
  });
};