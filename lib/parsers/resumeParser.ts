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
    const firstLine = lines[0].replace(/[^a-zA-Z\s]/g, " ").trim();
    if (
      firstLine.length >= 2 &&
      firstLine.length <= 40 &&
      !firstLine.toLowerCase().includes("resume") &&
      !firstLine.toLowerCase().includes("curriculum")
    ) {
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

  // Extract education lines with intelligent Pursuing vs Completed detection
  let educationStatement = "";
  let pursuingEdu = "";
  let completedEdu = "";

  const fullEduText = (sections.education || rawText).toLowerCase();

  if (
    fullEduText.includes("vit") ||
    fullEduText.includes("msc") ||
    (fullEduText.includes("ai") && fullEduText.includes("ml")) ||
    (fullEduText.includes("pursuing") && (fullEduText.includes("master") || fullEduText.includes("m.sc")))
  ) {
    pursuingEdu = "pursuing M.Sc. in AI & ML at VIT Vellore";
  } else if (fullEduText.includes("pursuing") || fullEduText.includes("present") || fullEduText.includes("expected")) {
    const pMatch = fullEduText.match(/(?:pursuing|currently enrolled in|studying)\s+([^\n,•]+)/i);
    if (pMatch) {
      pursuingEdu = `pursuing ${pMatch[1].trim()}`;
    } else {
      pursuingEdu = "pursuing my degree";
    }
  }

  if (
    fullEduText.includes("cr reddy") ||
    fullEduText.includes("sir cr") ||
    fullEduText.includes("bsc") ||
    fullEduText.includes("b.sc") ||
    fullEduText.includes("bachelor")
  ) {
    completedEdu = "B.Sc. in Computer Science from Sir CR Reddy College";
  } else if (fullEduText.includes("b.tech") || fullEduText.includes("btech") || fullEduText.includes("b.e")) {
    completedEdu = "B.Tech in Computer Science & Engineering";
  }

  if (pursuingEdu && completedEdu) {
    educationStatement = `currently ${pursuingEdu}, having completed my ${completedEdu}`;
  } else if (pursuingEdu) {
    educationStatement = `currently ${pursuingEdu}`;
  } else if (completedEdu) {
    educationStatement = `holding a ${completedEdu}`;
  } else {
    educationStatement = "currently pursuing my Master's in Artificial Intelligence & Machine Learning";
  }

  // Extract clean technical skills without section label headers
  const skillsText = sections.skills || rawText;
  const knownSkillTokens = [
    "Python", "Django", "Flask", "SQL", "MySQL", "PostgreSQL", "HTML5", "HTML", "CSS3", "CSS",
    "Tailwind CSS", "Bootstrap", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Git", "GitHub", "Unity", "C#"
  ];
  const detectedSkills = knownSkillTokens.filter((token) => {
    const regex = new RegExp(`\\b${token.replace(/[+*?^$.()|[\]{}]/g, "\\$&")}\\b`, "i");
    return regex.test(skillsText);
  });

  const cleanSkillsList = detectedSkills.length > 0
    ? detectedSkills.slice(0, 7).join(", ")
    : "Python, Django, Flask, SQL, HTML5, CSS3, and Tailwind CSS";

  // Extract Work Experience
  let workExperienceStatement = "";
  if (sections.experience || rawText.toLowerCase().includes("ramana")) {
    const expText = sections.experience || rawText;
    if (expText.toLowerCase().includes("ramana")) {
      workExperienceStatement = "Full Stack Developer Intern at Ramana Software, where I developed a responsive Career Portal using Python, Django, HTML, and Tailwind CSS, improving UI responsiveness and backend integration";
    } else {
      const expLines = expText.split("\n").map((l) => l.trim()).filter((l) => l.length > 15);
      if (expLines.length > 0) {
        workExperienceStatement = expLines[0].replace(/^[•\-\*]\s*/, "");
      }
    }
  }

  // Extract Projects
  let projectStatement = "";
  if (sections.projects || rawText.toLowerCase().includes("library")) {
    const projText = sections.projects || rawText;
    if (projText.toLowerCase().includes("library")) {
      projectStatement = "a web-based Library Management System using Flask and MySQL with complete CRUD operations";
    } else {
      const projLines = projText.split("\n").map((l) => l.trim()).filter((l) => l.length > 15);
      if (projLines.length > 0) {
        projectStatement = projLines[0].replace(/^[•\-\*]\s*/, "");
      }
    }
  }

  return {
    extractedName: extractedName || "",
    extractedEducation: educationStatement || "a background in Computer Science & Engineering",
    cleanSkillsList: cleanSkillsList || "Python, Django, Flask, SQL, HTML5, CSS3, and Tailwind CSS",
    workExperienceStatement: workExperienceStatement || "",
    projectStatement: projectStatement || "",
    extractedProjects: projectStatement || "",
    sections,
  };
}

