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
