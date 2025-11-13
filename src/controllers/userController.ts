import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSuggestions(req: Request, res: Response) {
  try {
    const userId = Number(res.locals.userId);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const candidates = await prisma.user.findMany({
      where: { id: { not: userId } },
      select: { id: true, name: true, image_url: true },
      take: 50,
    });

    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const top = candidates.slice(0, 5);

    const ids = top.map((u: { id: number; name: string; image_url: string }) => u.id);
    const edges = await prisma.follow.findMany({
      where: { followingId: userId, followerId: { in: ids } },
      select: { followerId: true },
    });
    const followersSet = new Set(edges.map((e: { followerId: number }) => e.followerId));

    const suggestions = top.map((u: { id: number; name: string; image_url: string }) => ({
      id: u.id,
      name: u.name,
      image_url: u.image_url,
      followsYou: followersSet.has(u.id),
    }));

    return res.json(suggestions);
  } catch (err) {
    console.error("Erro ao buscar sugestões:", err);
    return res.status(500).json({ message: "Erro interno ao buscar sugestões" });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const userId = Number(res.locals.userId);

    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        age: true,
        image_url: true,
        about: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      age: user.age,
      image_url: user.image_url,
      about: user.about,
    });
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    return res.status(500).json({ message: "Erro interno ao buscar perfil." });
  }
}

export async function updateMe(req: Request, res: Response) {
  try {
    const userId = Number(res.locals.userId);
    const { name, age, imageUrl, about } = req.body as {
      name?: string;
      age?: number | null;
      imageUrl?: string | null;
      about?: string | null;
    };

    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const trimmedImageUrl = imageUrl?.trim();

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name?.trim() || user.name,
        age: typeof age === "number" ? age : user.age,
        image_url: trimmedImageUrl ? trimmedImageUrl : undefined,
        about: about?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        age: true,
        image_url: true,
        about: true,
      },
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    return res.status(500).json({ message: "Erro interno ao atualizar perfil." });
  }
}
