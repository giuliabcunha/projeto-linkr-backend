import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPost(req: Request, res: Response) {
  try {
    const userId = Number(res.locals.userId);
    const link = String(req.body?.link ?? "").trim();
    const description = String(req.body?.description ?? "");
    if (!link) return res.status(400).json({ message: "O campo 'link' é obrigatório." });

    const post = await prisma.post.create({
      data: { userId, link, description },
      include: { user: { select: { id: true, name: true, image_url: true } } },
    });

    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: "Erro ao criar post." });
  }
}

export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { id: "desc" },
      include: { user: { select: { id: true, name: true, image_url: true } } },
    });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: "Erro ao buscar posts." });
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "ID inválido." });

    const userId = Number(res.locals.userId);
    const link = String(req.body?.link ?? "").trim();
    const description = String(req.body?.description ?? "");

    if (!link) return res.status(400).json({ message: "O campo 'link' é obrigatório." });

    const result = await prisma.post.updateMany({
      where: { id, userId },
      data: { link, description },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Post não encontrado ou você não é o autor." });
    }

    const updated = await prisma.post.findUnique({
      where: { id },
      select: { id: true, link: true, description: true, userId: true },
    });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Erro ao atualizar post." });
  }
}
