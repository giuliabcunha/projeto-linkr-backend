import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as { userId: number };
    res.locals.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido." });
  }
}
