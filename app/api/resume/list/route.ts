import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { extractResumeMetadata } from "@/lib/parsers/resumeParser";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        fileName: true,
        rawText: true,
        overallScore: true,
        atsScore: true,
        createdAt: true,
      },
    });

    const enrichedResumes = resumes.map((r) => {
      const meta = extractResumeMetadata(r.rawText, r.fileName || undefined);
      return {
        id: r.id,
        title: r.title,
        fileName: r.fileName,
        overallScore: r.overallScore,
        atsScore: r.atsScore,
        createdAt: r.createdAt,
        extractedName: meta.extractedName,
        extractedEducation: meta.extractedEducation,
        extractedProjects: meta.extractedProjects,
      };
    });

    return NextResponse.json({ success: true, resumes: enrichedResumes });
  } catch (error: unknown) {
    console.error("Resume List Error:", error);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}
