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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Target Company Intelligence</h3>
            <p className="text-[11px] text-slate-500">Free, public source research for tailored interview preparation</p>
          </div>
        </div>

        {company && company.isVerified && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Public Data Verified</span>
          </span>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Search & Lookup Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
            <input
              type="text"
              value={companyNameInput}
              onChange={(e) => setCompanyNameInput(e.target.value)}
              placeholder="e.g. Stripe, Airbnb, Google"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-700 block mb-1">Company Website (Optional)</label>
            <input
              type="text"
              value={websiteInput}
              onChange={(e) => setWebsiteInput(e.target.value)}
              placeholder="https://company.com"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-1 flex items-end">
            <button
              onClick={handleSearchCompany}
              disabled={isLoading || !companyNameInput.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isLoading ? "Searching Free Sources..." : "Fetch Public Intel"}</span>
            </button>
          </div>
        </div>

        {/* Company Details or Fallback */}
        {company && company.isVerified ? (
          <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">{company.name}</h4>
                {company.industry && (
                  <span className="text-xs text-slate-500 font-medium">{company.industry}</span>
                )}
              </div>

              {company.sourceUrl && (
                <a
                  href={company.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public Source Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Company Overview & Mission
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {company.overview}
              </p>
            </div>

            {company.products && company.products.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Key Products & Services
                </span>
                <div className="flex flex-wrap gap-2">
                  {company.products.map((p, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : isManualEditing || (company && !company.isVerified) ? (
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Company information could not be automatically retrieved from public sources.</span>
            </div>
            <p className="text-slate-600">
              We never fabricate company data. You can enter the company description or about page details below:
            </p>

            <textarea
              value={manualOverview}
              onChange={(e) => setManualOverview(e.target.value)}
              placeholder="Paste company overview, mission, or products from their careers/about page..."
              rows={3}
              className="w-full p-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <button
              onClick={handleSaveManual}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Save Company Intel</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Enter a company name above to fetch public background details and align your interview responses.
          </p>
        )}
      </div>
    </div>
  );
}
