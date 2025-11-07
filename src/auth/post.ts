import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPost(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    const { link, description } = req.body;

    if (!link || link.trim() === "") {
      return res.status(400).json({ message: "O campo 'link' é obrigatório." });
    }

    const post = await prisma.post.create({
      data: {
        userId,
        link: link.trim(),
        description: description?.trim() || null,
      },
    });

    return res.status(201).json(post);
  } catch (err) {
    console.error("Erro ao criar post:", err);
    return res.status(500).json({ message: "Erro interno ao criar post." });
  }
}

export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await prisma.post.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image_url: true
          },
        },
      },
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Erro ao buscar posts:", err);
    return res.status(500).json({ message: "Erro interno ao buscar posts." });
  }
}