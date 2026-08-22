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

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: user.userId,
      },
      include: {
        sections: true,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Error fetching resume";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    await prisma.resume.deleteMany({
      where: {
        id,
        userId: user.userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Error deleting resume";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
