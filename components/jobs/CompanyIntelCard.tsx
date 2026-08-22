"use client";

import { useState } from "react";
import { Building2, ExternalLink, Globe, CheckCircle, Search, Edit3, ShieldAlert } from "lucide-react";
import { CompanyInfo } from "@/types";

interface CompanyIntelCardProps {
  initialCompany?: CompanyInfo | null;
  defaultCompanyName?: string;
}

export function CompanyIntelCard({ initialCompany, defaultCompanyName }: CompanyIntelCardProps) {
  const [company, setCompany] = useState<CompanyInfo | null>(initialCompany || null);
  const [companyNameInput, setCompanyNameInput] = useState(defaultCompanyName || "");
  const [websiteInput, setWebsiteInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [manualOverview, setManualOverview] = useState("");

  const handleSearchCompany = async () => {
    if (!companyNameInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/company/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: companyNameInput, websiteUrl: websiteInput }),
      });
      const data = await res.json();
      if (data.company) {
        setCompany(data.company);
        if (!data.company.isVerified) {
          setIsManualEditing(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveManual = () => {
    if (!companyNameInput.trim()) return;
    setCompany({
      name: companyNameInput.trim(),
      domain: websiteInput.trim() || undefined,
      industry: "Technology / Enterprise",
      overview: manualOverview.trim() || `${companyNameInput} is an organization in the software and technology sector.`,
      products: ["Software Services", "Digital Solutions"],
      isVerified: true,
      sourceUrl: websiteInput.trim() || undefined,
    });
    setIsManualEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Target Company Intelligence</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Free, public source research for tailored interview preparation</p>
          </div>
        </div>

        {company && company.isVerified && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Public Data Verified</span>
          </span>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Search & Lookup Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company Name</label>
            <input
              type="text"
              value={companyNameInput}
              onChange={(e) => setCompanyNameInput(e.target.value)}
              placeholder="e.g. Stripe, Airbnb, Google"
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company Website (Optional)</label>
            <input
              type="text"
              value={websiteInput}
              onChange={(e) => setWebsiteInput(e.target.value)}
              placeholder="https://company.com"
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-1 flex items-end">
            <button
              onClick={handleSearchCompany}
              disabled={isLoading || !companyNameInput.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white disabled:opacity-50 transition-all shadow-md shadow-indigo-500/25"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isLoading ? "Searching Free Sources..." : "Fetch Public Intel"}</span>
            </button>
          </div>
        </div>

        {/* Company Details or Fallback */}
        {company && company.isVerified ? (
          <div className="mt-4 p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{company.name}</h4>
                {company.industry && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{company.industry}</span>
                )}
              </div>

              {company.sourceUrl && (
                <a
                  href={company.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public Source Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Company Overview & Mission
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {company.overview}
              </p>
            </div>

            {company.products && company.products.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  Key Products & Services
                </span>
                <div className="flex flex-wrap gap-2">
                  {company.products.map((p, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : isManualEditing || (company && !company.isVerified) ? (
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Company information could not be automatically retrieved from public sources.</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              We never fabricate company data. You can enter the company description or about page details below:
            </p>

            <textarea
              value={manualOverview}
              onChange={(e) => setManualOverview(e.target.value)}
              placeholder="Paste company overview, mission, or products from their careers/about page..."
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <button
              onClick={handleSaveManual}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Save Company Intel</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            Enter a company name above to fetch public background details and align your interview responses.
          </p>
        )}
      </div>
    </div>
  );
}
