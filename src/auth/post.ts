import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPost(req: Request, res: Response) {
  try {
    const userId = Number(res.locals.userId);
    const { link, description } = req.body;

    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const trimmedLink = String(link ?? "").trim();

    if (!trimmedLink) {
      return res.status(400).json({ message: "O campo 'link' é obrigatório." });
    }

    try {
      new URL(trimmedLink);
    } catch {
      return res.status(400).json({ message: "Link inválido." });
    }

    const post = await prisma.post.create({
      data: {
        userId,
        link: trimmedLink,
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
            image_url: true,
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

export async function updatePost(req: Request, res: Response) {
  try {
    const userId = Number(res.locals.userId);
    const postId = Number(req.params.id);
    const { link, description } = req.body;

    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    if (Number.isNaN(postId)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const trimmedLink = String(link ?? "").trim();

    if (!trimmedLink) {
      return res.status(400).json({ message: "O campo 'link' é obrigatório." });
    }

    try {
      new URL(trimmedLink);
    } catch {
      return res.status(400).json({ message: "Link inválido." });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado." });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "Você não tem permissão para editar este post." });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        link: trimmedLink,
        description: description?.trim() || null,
      },
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Erro ao atualizar post:", err);
    return res.status(500).json({ message: "Erro interno ao atualizar post." });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    const postId = Number(req.params.id);

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado." });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "Você não tem permissão para deletar este post." });
    }

    await prisma.post.delete({ where: { id: postId } });

    return res.status(200).json({ message: "Post deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar post:", err);
    return res.status(500).json({ message: "Erro interno ao deletar post." });
  }
}

export async function getMyPosts(req: Request, res: Response) {
  try {
    const userId = Number(res.locals.userId);

    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image_url: true,
          },
        },
      },
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Erro ao buscar posts do usuário:", err);
    return res.status(500).json({ message: "Erro interno ao buscar posts do usuário." });
  }
}
