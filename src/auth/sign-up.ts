import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function signUp(req: Request, res: Response) {
  const { name, email, password, image_url } = req.body;

  if (!name || !email || !password) return res.status(400).send({message: "Preencha todos os campos."});

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(409).send({message: "Email já cadastrado."});

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, image_url },
  });

  res.status(201).send({message: "Usuário criado com sucesso!"});
}
