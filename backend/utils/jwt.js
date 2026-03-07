import jwt from "jsonwebtoken";

export function getUserIdFromToken(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded?.sub || null;
  } catch {
    return null;
  }
}