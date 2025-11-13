import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (!token || scheme !== "Bearer") {
    return res.status(401).json({ message: "Token ausente." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    // agora bate com o signIn
    res.locals.userId = payload.userId;

    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido." });
  }
}
