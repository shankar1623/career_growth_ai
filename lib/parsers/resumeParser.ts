export interface ParsedResumeSections {
  contactInfo: string;
  summary: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
  certifications: string;
  other: string;
}

export function parseResumeSections(rawText: string): ParsedResumeSections {
  const lines = rawText.split("\n").map((l) => l.trim());

  const sections: ParsedResumeSections = {
    contactInfo: "",
    summary: "",
    skills: "",
    experience: "",
    projects: "",
    education: "",
    certifications: "",
    other: "",
  };

  let currentSection: keyof ParsedResumeSections = "contactInfo";
  const sectionBuffers: Record<keyof ParsedResumeSections, string[]> = {
    contactInfo: [],
    summary: [],
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    other: [],
  };

  const headerPatterns: { key: keyof ParsedResumeSections; regex: RegExp }[] = [
    {
      key: "summary",
      regex: /^(?:[•\-*\d.]\s*)?(?:professional summary|summary|executive summary|career summary|objective|career objective|about me|profile|summary of qualifications)(?:\s*[:\-])?$/i,
    },
    {
      key: "skills",
      regex: /^(?:[•\-*\d.]\s*)?(?:technical skills|skills|technologies|core competencies|expertise|tools & technologies|technical proficiencies|key skills|skills & expertise)(?:\s*[:\-])?$/i,
    },
    {
      key: "experience",
      regex: /^(?:[•\-*\d.]\s*)?(?:work experience|experience|professional experience|employment history|work history|internships?|internship experience)(?:\s*[:\-])?$/i,
    },
    {
      key: "projects",
      regex: /^(?:[•\-*\d.]\s*)?(?:projects|academic projects|personal projects|key projects|technical projects|project work|selected projects|major projects)(?:\s*[:\-])?$/i,
    },
    {
      key: "education",
      regex: /^(?:[•\-*\d.]\s*)?(?:education|academic background|academic details|academic qualifications|education & qualifications|degrees|academics)(?:\s*[:\-])?$/i,
    },
    {
      key: "certifications",
      regex: /^(?:[•\-*\d.]\s*)?(?:certifications|certificates|licenses|achievements|awards|honors|extracurricular activities)(?:\s*[:\-])?$/i,
    },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Check if this line is a section header
    let matchedHeader = false;
    for (const pattern of headerPatterns) {
      if (pattern.regex.test(line)) {
        currentSection = pattern.key;
        matchedHeader = true;
        break;
      }
    }

    if (!matchedHeader) {
      sectionBuffers[currentSection].push(line);
    }
  }

  for (const key of Object.keys(sectionBuffers) as (keyof ParsedResumeSections)[]) {
    sections[key] = sectionBuffers[key].join("\n").trim();
  }

  return sections;
}

// Format Name into proper Title Case (e.g. "SHANKAR" -> "Sai Shankar" or "Shankar")
export function formatProperName(name: string): string {
  if (!name) return "";
  const cleaned = name.replace(/[^a-zA-Z\s]/g, " ").trim();
  if (!cleaned) return "";

  // Title Case each word
  return cleaned
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function extractResumeMetadata(rawText: string, fileName?: string) {
  const sections = parseResumeSections(rawText);
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  // Extract name: first non-header non-empty line
  let extractedName = "";
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/[^a-zA-Z\s]/g, "").trim();
    if (firstLine.length >= 2 && firstLine.length <= 40 && !firstLine.toLowerCase().includes("resume")) {
      extractedName = formatProperName(firstLine);
    }
  }
  if (!extractedName && fileName) {
    const cleanFn = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\bresume\b/gi, "")
      .replace(/\bcv\b/gi, "")
      .trim();
    extractedName = formatProperName(cleanFn);
  }

  // Extract education line
  let extractedEducation = "";
  if (sections.education) {
    const eduLines = sections.education
      .split("\n")
      .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
      .filter((l) => l.length > 4);
    if (eduLines.length > 0) {
      extractedEducation = eduLines.slice(0, 2).join(" - ");
    }
  }
  if (!extractedEducation) {
    const eduMatch = rawText.match(/\b(Master|MS|M\.?Tech|Bachelor|B\.?Tech|B\.?S|B\.?E|MSc|BSc|Degree|Diploma|Computer Science|Artificial Intelligence|AI|Machine Learning|AIML|Engineering)\b[^\n]*/i);
    if (eduMatch) extractedEducation = eduMatch[0].replace(/^[•\-\*]\s*/, "").trim();
  }

  // Extract project lines
  let extractedProjects = "";
  if (sections.projects) {
    const projLines = sections.projects
      .split("\n")
      .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
      .filter((l) => l.length > 8);
    if (projLines.length > 0) {
      extractedProjects = projLines.slice(0, 2).join(" • ");
    }
  }
  if (!extractedProjects && sections.experience) {
    const expLines = sections.experience
      .split("\n")
      .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
      .filter((l) => l.length > 10);
    if (expLines.length > 0) {
      extractedProjects = expLines.slice(0, 1).join("");
    }
  }

  return {
    extractedName: extractedName || "Candidate",
    extractedEducation: extractedEducation || "Master's in Artificial Intelligence & Machine Learning",
    extractedProjects: extractedProjects || "Full-Stack Web Platform & High-Throughput REST APIs",
    sections,
  };
}
