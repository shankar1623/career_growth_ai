import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { matchJobDescription } from "@/lib/ai/aiProvider";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, resumeText, jdText, jobTitle, companyName, sourceUrl } = await req.json();

    let resolvedJD = (jdText || "").trim();
    const resolvedTitle = (jobTitle || "Software Engineer").trim();
    const resolvedCompany = (companyName || "Target Company").trim();

    if (resolvedJD.length < 15) {
      resolvedJD = `Role: ${resolvedTitle}
Company: ${resolvedCompany}
Requirements:
• Experience with modern web technologies: React, TypeScript, JavaScript, and Node.js.
• Experience with relational databases: PostgreSQL, SQL queries, and database indexing.
• Familiarity with cloud technologies, Docker, RESTful APIs, and CI/CD pipelines.
• Strong problem-solving, collaboration, and code quality standards.`;
    }

    let resolvedResumeText = resumeText || "";
    let activeResumeId = resumeId;

    if (resumeId && !resolvedResumeText) {
      const dbResume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: user.userId },
      });
      if (dbResume) {
        resolvedResumeText = dbResume.rawText;
      }
    }

    if (!resolvedResumeText || resolvedResumeText.trim().length < 20) {
      // Check for user's latest uploaded resume
      const latestResume = await prisma.resume.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
      });
      if (latestResume) {
        resolvedResumeText = latestResume.rawText;
        activeResumeId = latestResume.id;
      } else {
        resolvedResumeText = `Software Developer with experience building modern web applications, TypeScript, React, Node.js, and SQL databases.`;
      }
    }

    // Run AI Match analysis
    const matchAnalysis = await matchJobDescription(resolvedResumeText, resolvedJD);

    // Save Job Description and Job Match records in DB
    let savedMatch;
    try {
      const savedJD = await prisma.jobDescription.create({
        data: {
          userId: user.userId,
          title: resolvedTitle,
          companyName: resolvedCompany,
          rawText: resolvedJD,
          sourceUrl: sourceUrl || undefined,
          parsedSkills: JSON.stringify(matchAnalysis.strongMatches),
          parsedKeywords: JSON.stringify(matchAnalysis.missingKeywords),
        },
      });

      if (activeResumeId) {
        savedMatch = await prisma.jobMatch.create({
          data: {
            userId: user.userId,
            resumeId: activeResumeId,
            jobDescriptionId: savedJD.id,
            overallMatch: matchAnalysis.overallMatch,
            skillsMatch: matchAnalysis.skillsMatch,
            experienceMatch: matchAnalysis.experienceMatch,
            keywordMatch: matchAnalysis.keywordMatch,
            projectRelevance: matchAnalysis.projectRelevance,
            educationMatch: matchAnalysis.educationMatch,
            responsibilitiesMatch: matchAnalysis.responsibilitiesMatch,
            atsMatch: matchAnalysis.atsMatch,
            strongMatches: JSON.stringify(matchAnalysis.strongMatches),
            missingSkills: JSON.stringify(matchAnalysis.missingSkills),
            missingKeywords: JSON.stringify(matchAnalysis.missingKeywords),
            recommendations: JSON.stringify(matchAnalysis.recommendations),
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB save job match failed, continuing with payload:", dbErr);
    }

    return NextResponse.json({
      success: true,
      matchId: savedMatch?.id || "temp-match-id",
      analysis: matchAnalysis,
    });
  } catch (error: unknown) {
    console.error("Job Match Route Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to analyze job match.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
