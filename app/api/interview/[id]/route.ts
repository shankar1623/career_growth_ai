import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const interview = await prisma.interview.findFirst({
      where: {
        id,
        userId: user.userId,
      },
      include: {
        rounds: {
          orderBy: { roundNumber: "asc" },
          include: {
            questions: {
              orderBy: { orderIndex: "asc" },
              include: {
                answers: true,
              },
            },
            codingSubmissions: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
    }

    return NextResponse.json({ interview });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Error fetching interview.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
