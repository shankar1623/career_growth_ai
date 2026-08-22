import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Math.round(Math.min(100, Math.max(0, score)))}`;
}

export function getScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  ring: string;
  badge: string;
} {
  if (score >= 80) {
    return {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      ring: "ring-emerald-500",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
  }
  if (score >= 60) {
    return {
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      ring: "ring-blue-500",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
    };
  }
  if (score >= 40) {
    return {
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      ring: "ring-amber-500",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
    };
  }
  return {
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    ring: "ring-rose-500",
    badge: "bg-rose-100 text-rose-800 border-rose-300",
  };
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return "Recently";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}
