import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { generateSelfIntroduction } from "@/lib/ai/aiProvider";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      resumeId,
      resumeText,
      candidateName,
      education,
      companyName,
      targetRole,
      keyProjects,
      jdText,
    } = await req.json();

    let resolvedResumeText = resumeText || "";

    if (resumeId && !resolvedResumeText) {
      const dbResume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: user.userId },
      });
      if (dbResume) {
        resolvedResumeText = dbResume.rawText;
      }
    }

    if (!resolvedResumeText) {
      const latestResume = await prisma.resume.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
      });
      if (latestResume) {
        resolvedResumeText = latestResume.rawText;
      }
    }

    const result = await generateSelfIntroduction({
      candidateName: candidateName || user.name || "Candidate",
      education: education || "Computer Science & Engineering",
      targetRole: targetRole || "Full-Stack Software Engineer",
      companyName: companyName || "the engineering team",
      keyProjects: keyProjects || "",
      resumeText: resolvedResumeText || "Software developer building modern web applications",
      jdText,
    });

    try {
      await prisma.selfIntroduction.create({
        data: {
          userId: user.userId,
          resumeId: resumeId || undefined,
          targetRole: targetRole || "Software Engineer",
          companyName: companyName || undefined,
          pitch30: result.pitch30,
          pitch60: result.pitch60,
          pitch90: result.pitch90,
          whyItWorks: result.whyItWorks,
          keyHighlights: JSON.stringify(result.keyHighlights),
        },
      });
    } catch (dbErr) {
      console.warn("DB save self introduction deferred:", dbErr);
    }

    return NextResponse.json({
      success: true,
      introduction: result,
    });
  } catch (error: unknown) {
    console.error("Self Introduction Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to generate self-introduction.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
