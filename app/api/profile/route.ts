import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Counts
    const [resumesCount, interviewsCount, roadmapCount, completedRoadmapItems] = await Promise.all([
      prisma.resume.count({ where: { userId: user.userId } }),
      prisma.interview.count({ where: { userId: user.userId, status: "COMPLETED" } }),
      prisma.learningRoadmap.count({ where: { userId: user.userId } }),
      prisma.roadmapItem.count({
        where: { roadmap: { userId: user.userId }, isCompleted: true },
      }),
    ]);

    const totalRoadmapItems = await prisma.roadmapItem.count({
      where: { roadmap: { userId: user.userId } },
    });

    return NextResponse.json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
      },
      stats: {
        resumesCount,
        interviewsCount,
        roadmapCount,
        completedRoadmapItems,
        totalRoadmapItems: totalRoadmapItems || 4,
      },
      system: {
        aiProvider: process.env.AI_PROVIDER || "groq",
        groqModel: process.env.GROQ_MODEL || "qwen/qwen3.6-27b",
        database: "Neon PostgreSQL",
      },
    });
  } catch (error: unknown) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Failed to load profile data" }, { status: 500 });
  }
}
