import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/userHelper";
import { fetchCompanyInformation } from "@/lib/search/searchProvider";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyName, websiteUrl } = await req.json();

    if (!companyName || !companyName.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    const companyInfo = await fetchCompanyInformation(companyName, websiteUrl);

    if (companyInfo && companyInfo.isVerified) {
      try {
        await prisma.company.create({
          data: {
            userId: user.userId,
            name: companyInfo.name,
            domain: companyInfo.domain,
            industry: companyInfo.industry,
            overview: companyInfo.overview,
            products: JSON.stringify(companyInfo.products),
            mission: companyInfo.mission,
            culture: companyInfo.culture,
            sourceUrl: companyInfo.sourceUrl,
            isVerified: companyInfo.isVerified,
          },
        });
      } catch (dbErr) {
        console.warn("DB company save deferred:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      company: companyInfo,
    });
  } catch (error: unknown) {
    console.error("Company Research Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to retrieve company data.";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
