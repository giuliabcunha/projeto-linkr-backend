import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send("Preencha email e senha.");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).send("Email ou senha incorretos.");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send("Email ou senha incorretos.");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.send({ token });
}
