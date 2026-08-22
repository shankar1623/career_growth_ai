import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, isCompleted } = await req.json();

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const item = await prisma.roadmapItem.findUnique({
      where: { id: itemId },
      include: { roadmap: true },
    });

    if (!item || item.roadmap.userId !== user.userId) {
      return NextResponse.json({ error: "Roadmap item not found or unauthorized" }, { status: 404 });
    }

    // Update item status
    await prisma.roadmapItem.update({
      where: { id: itemId },
      data: {
        isCompleted: !!isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Recalculate overall roadmap progress
    const allItems = await prisma.roadmapItem.findMany({
      where: { roadmapId: item.roadmapId },
    });

    const completedCount = allItems.filter((i) => i.isCompleted).length;
    const progressPct = allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 0;

    await prisma.learningRoadmap.update({
      where: { id: item.roadmapId },
      data: { overallProgress: progressPct },
    });

    return NextResponse.json({
      success: true,
      isCompleted: !!isCompleted,
      overallProgress: progressPct,
    });
  } catch (error: unknown) {
    console.error("Roadmap Toggle Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to update item.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
