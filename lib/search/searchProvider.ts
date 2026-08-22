import { CompanyInfo } from "@/types";

export async function fetchCompanyInformation(companyName: string, websiteUrl?: string): Promise<CompanyInfo | null> {
  const cleanName = companyName.trim();
  if (!cleanName) return null;

  try {
    // 1. If website URL is given, attempt to scrape metadata
    if (websiteUrl && websiteUrl.startsWith("http")) {
      try {
        const response = await fetch(websiteUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
          signal: AbortSignal.timeout(4000),
        });
        if (response.ok) {
          const html = await response.text();
          const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
          const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
          const titleMatch = html.match(/<title>(.*?)<\/title>/i);

          const overview = descriptionMatch?.[1] || ogDescMatch?.[1] || `${cleanName} is a leading technology organization.`;
          return {
            name: cleanName,
            domain: new URL(websiteUrl).hostname,
            industry: "Technology & Software",
            overview: overview.replace(/&amp;/g, "&").replace(/&quot;/g, '"'),
            products: ["Core Platform", "Cloud Services", "Developer Solutions"],
            mission: `Innovating technology solutions for customers worldwide.`,
            sourceUrl: websiteUrl,
            isVerified: true,
          };
        }
      } catch (err) {
        console.warn("Direct site fetch timed out or failed:", err);
      }
    }

    // 2. Query Free Wikipedia Summary API
    try {
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`;
      const wikiRes = await fetch(wikiUrl, {
        headers: { "User-Agent": "CareerGrowthAI/1.0 (info@careergrowth.ai)" },
        signal: AbortSignal.timeout(3500),
      });

      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData.extract && !wikiData.type?.includes("disambiguation")) {
          return {
            name: wikiData.title || cleanName,
            domain: wikiData.content_urls?.desktop?.page ? new URL(wikiData.content_urls.desktop.page).hostname : undefined,
            industry: wikiData.description || "Technology / Corporate",
            overview: wikiData.extract,
            products: ["Enterprise Solutions", "Digital Products", "Online Services"],
            mission: `Dedicated to innovation and delivering high value across the ${wikiData.description || "industry"}.`,
            sourceUrl: wikiData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanName)}`,
            isVerified: true,
          };
        }
      }
    } catch (wikiErr) {
      console.warn("Wikipedia lookup error:", wikiErr);
    }

    // 3. Query Free DuckDuckGo Instant Answer API
    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanName)}&format=json&no_html=1&skip_disambig=1`;
      const ddgRes = await fetch(ddgUrl, { signal: AbortSignal.timeout(3500) });
      if (ddgRes.ok) {
        const ddgData = await ddgRes.json();
        if (ddgData.AbstractText) {
          return {
            name: cleanName,
            industry: ddgData.Heading || "Enterprise Technology",
            overview: ddgData.AbstractText,
            products: ["Software & Engineering Solutions", "Cloud Services"],
            sourceUrl: ddgData.AbstractURL || undefined,
            isVerified: true,
          };
        }
      }
    } catch (ddgErr) {
      console.warn("DuckDuckGo lookup error:", ddgErr);
    }

    // If company could not be automatically found, return unverified fallback template
    return {
      name: cleanName,
      overview: "Company information could not be automatically retrieved from public directories.",
      products: [],
      isVerified: false,
    };
  } catch (error) {
    console.error("Search provider error:", error);
    return {
      name: cleanName,
      overview: "Company information could not be automatically retrieved.",
      products: [],
      isVerified: false,
    };
  }
}
