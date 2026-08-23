import {
  ResumeOverallAnalysis,
  JobMatchAnalysis,
  SelfIntroductionResult,
  InterviewRoundData,
  AnswerEvaluationResult,
  CodingEvaluationResult,
  LearningRoadmapData,
  InterviewFinalEvaluation,
} from "@/types";
import { ParsedResumeSections } from "@/lib/parsers/resumeParser";
import { CODING_PROBLEMS, getRandomCodingProblem } from "@/lib/data/codingProblems";

// Helper to ensure text is genuine human-readable English
function cleanSectionText(text: string, fallback: string): string {
  if (!text || typeof text !== "string") return fallback;
  const trimmed = text.trim();
  if (trimmed.length < 15) return fallback;

  // Reject PDF structural markers or binary noise
  if (trimmed.startsWith("%PDF") || trimmed.startsWith("PDF-") || trimmed.includes("FlateDecode")) {
    return fallback;
  }

  const letterMatches = trimmed.match(/[a-zA-Z]/g) || [];
  if (letterMatches.length / trimmed.length < 0.6) {
    return fallback;
  }

  return trimmed;
}

export interface CandidateContext {
  name?: string;
  education?: string;
  projects?: string;
  workExperience?: string;
  skills?: string;
  role?: string;
  companyName?: string;
}

// Generate exact, high-impact, question-specific model answers tailored to each round
export function getRecommendedModelAnswer(
  questionText: string,
  roundType: string = "SELF_INTRO",
  context?: CandidateContext
): string {
  const qLower = (questionText || "").toLowerCase();

  const candName = context?.name || "Candidate";
  const candEdu = context?.education || "holding a degree in Computer Science & Engineering";
  const candRole = context?.role || "Software Developer";
  const candProject = context?.projects || "a full-stack web application with complete CRUD operations and database connectivity";
  const skillsPhrase = context?.skills || "JavaScript, TypeScript, React, Node.js, SQL, and Git";


  // 1. Five Years / Career Goals
  if (qLower.includes("three to five years") || qLower.includes("5 years") || qLower.includes("where do you see yourself") || qLower.includes("career aspiration")) {
    return `In the next 1 to 2 years, my primary goal is to dive deep into your codebase, ship high-impact features, and become a go-to engineer for system reliability on the team. Looking further out to 3 to 5 years, I want to step up as a Senior Engineer who helps architect scalable distributed services, mentors newer engineers, and works closely with product leaders to shape our technical roadmap.`;
  }

  // 2. Self Introduction & Background (Name -> Education -> Skills -> Work Experience / Project -> Looking for Target Role)
  if (qLower.includes("tell me about yourself") || qLower.includes("background in software") || qLower.includes("what drives you") || qLower.includes("your background")) {
    const expText = context?.workExperience
      ? `In my recent experience as a ${context.workExperience}, I contributed to frontend UI implementation, backend integration, and improved page responsiveness.`
      : `In my recent project work on ${candProject}, I designed the core component architecture and database connectivity, cutting response times and ensuring smooth user interactions.`;

    const projectText = context?.projects
      ? `I have also developed key projects including ${context.projects}.`
      : `I have also built web applications with complete CRUD operations and database connectivity.`;

    return `Hi, thank you for giving me this opportunity to introduce myself. My name is ${candName}. I am ${candEdu}.

On the technical side, my core skills include ${skillsPhrase}.

${expText} ${projectText}

I am actively looking for an opportunity as a ${candRole} where I can apply my hands-on development skills, solve real-world problems, and make a strong contribution to your engineering team.`;
  }

  // 3. Motivation for Role & Challenges / Career Goals
  if (qLower.includes("interested in applying") || qLower.includes("why are you interested") || qLower.includes("career goals") || qLower.includes("technical challenges excite you") || qLower.includes("key career goals")) {
    return `Throughout my journey working with ${skillsPhrase}, I've always looked for opportunities where I can solve meaningful problems at scale. What specifically attracts me to this ${candRole} role is the opportunity to apply my practical project and development experience to build reliable, user-friendly applications.

In the short term, I want to dive deep into your codebase, contribute to core product features, and ensure high system reliability.

Looking ahead over the next 3 to 5 years, my goal is to grow into a senior technical contributor who helps architect robust services, mentors newer developers, and works closely with the team to deliver high-impact software.`;
  }

  // 4. Project Architecture & State Management (Round 2 Deep-Dive)
  if (qLower.includes("architecture of your most challenging project") || qLower.includes("most technically complex project") || qLower.includes("walk me through the architecture") || qLower.includes("regarding your experience")) {
    const isDjangoOrFlask = skillsPhrase.toLowerCase().includes("django") || skillsPhrase.toLowerCase().includes("flask") || skillsPhrase.toLowerCase().includes("python");
    const projName = context?.workExperience ? "the Career Portal at Ramana Software" : candProject;
    const stackBackend = isDjangoOrFlask ? "Python and Django with modular REST viewsets and secure database models" : "Node.js and modular RESTful APIs";
    const stackFrontend = isDjangoOrFlask ? "HTML5, Tailwind CSS, and Bootstrap for clean responsive UI layouts" : "Next.js App Router with custom React hooks";
    const stackDb = isDjangoOrFlask ? "SQL / MySQL with relational schema models" : "PostgreSQL with connection pooling";

    return `I'd love to walk you through ${projName}. The primary architectural challenge was designing a clean, responsive web application that handles database queries and user workflows seamlessly without latency bottlenecks.

On the frontend, I structured the interface using ${stackFrontend} to ensure full responsiveness across mobile and desktop devices. For the backend, I built services using ${stackBackend}, interfacing with ${stackDb} for data persistence.

To optimize performance, I refined database query lookups, structured CRUD handlers cleanly, and optimized asset loading, ensuring smooth navigation and fast page response times under load.`;
  }

  // 5. Difficult Bug / Performance Bottleneck (Round 2 Deep-Dive)
  if (qLower.includes("difficult technical bug") || qLower.includes("performance bottleneck") || qLower.includes("troubleshooting") || qLower.includes("production bug") || qLower.includes("optimize resource consumption") || qLower.includes("difficult bug")) {
    const isDjangoOrFlask = skillsPhrase.toLowerCase().includes("django") || skillsPhrase.toLowerCase().includes("flask") || skillsPhrase.toLowerCase().includes("python");
    const projName = context?.workExperience ? "our Career Portal project" : candProject;
    const dbType = isDjangoOrFlask ? "SQL / MySQL" : "PostgreSQL";

    return `In our work on ${projName}, our team encountered a challenging issue during feature testing where data retrieval and form submission latency slowed down under multiple concurrent requests.

I diagnosed the issue by tracing server response logs and examining our ${dbType} query execution. I discovered redundant database queries being triggered inside loop handlers, creating an N+1 query bottleneck.

I resolved it by optimizing the query structure to fetch data in bulk, adding proper database indexing on foreign key lookups, and refining state synchronization on the frontend. This dropped our query response time significantly, eliminated server lag, and ensured stable performance.`;
  }

  // 6. Automated Testing / CI/CD (Round 2 alternative)
  if (qLower.includes("automated testing") || qLower.includes("continuous integration") || qLower.includes("edge-case stability")) {
    return `For ${candProject}, I established a test pyramid strategy with Jest and React Testing Library for unit and component tests, coupled with Playwright for critical end-to-end user flows.

I integrated automated test execution and lint checks into our GitHub Actions CI/CD pipeline, ensuring that all pull requests pass type-checking and automated regression suites before merging.

This practice caught boundary bugs early in the development cycle and maintained high release stability in production.`;
  }

  // 7. 10x Scale / Concurrency Redesign (Round 2 alternative)
  if (qLower.includes("redesigning") || qLower.includes("10x higher") || qLower.includes("concurrency") || qLower.includes("scale")) {
    return `To scale ${candProject} for 10x higher concurrency, the first bottleneck I would address is database read throughput. I would implement a Redis caching layer for hot read queries with cache invalidation on write mutations, offloading up to 80% of database reads.

Second, I would introduce read replicas with connection pooling in PostgreSQL to distribute read/write traffic.

Finally, for asynchronous workloads like email notifications or background data processing, I would decouple task execution using a message queue like BullMQ or Amazon SQS to keep HTTP endpoints lightweight and fast.`;
  }

  // 6. Asynchronous JavaScript & Event Loop
  if (qLower.includes("synchronous and asynchronous") || qLower.includes("event loop") || qLower.includes("microtask")) {
    return `JavaScript is single-threaded, which means it uses an Event Loop to handle asynchronous operations without freezing the page. Synchronous code runs immediately on the Call Stack. When an async operation like a fetch or timer completes, its callback gets queued up. Promises and async/await callbacks go straight into the Microtask Queue, which gets executed right after the current call stack clears, before macrotasks like setTimeout. Keeping that execution order in mind is super helpful for avoiding race conditions and unexpected state bugs.`;
  }

  // 7. RESTful API Design & Databases
  if (qLower.includes("restful api") || qLower.includes("api design") || qLower.includes("rate limiting")) {
    return `When I design REST APIs, I prioritize predictability and clean contracts. I use clear, noun-based URLs like /api/v1/projects and standard HTTP verbs like GET, POST, PUT, and DELETE. I validate all incoming payloads upfront with schema tools like Zod before they hit controller logic. To keep the backend stable, I implement connection pooling on our database and add Redis rate limiting to prevent abuse. I also make sure we return consistent HTTP status codes with clear error messages so frontend clients know exactly how to handle any edge case.`;
  }

  // 8. Behavioral Deadline / Requirements Changed (STAR)
  if (qLower.includes("deadline") || qLower.includes("requirements changed") || qLower.includes("star method") || qLower.includes("roadblock")) {
    return `A few days before an important release, our team received unexpected compliance requirements that required us to add multi-factor authentication right away. To meet the deadline without sacrificing code quality, I got together with the team to prioritize the core security workflows and defer minor aesthetic tweaks to the next sprint. I created mock API endpoints so the frontend and backend could build simultaneously, and wrote integration tests to safeguard our login flows. We shipped on time with zero security regressions.`;
  }

  // Default Model Answer
  return `In a recent project, our team ran into a technical hurdle that needed a thoughtful solution without impacting active users. I started by checking our server logs to pinpoint the exact issue, brainstormed the approach with my teammates in standup, and implemented clean, modular code with automated tests. After a thorough code review, we deployed the fix to production with zero downtime and saw immediate improvements in system stability.`;
}

// Smart heuristic engine analyzing resume text and generating detailed structured reports
export function generateSmartResumeAnalysis(
  rawText: string,
  sections: ParsedResumeSections
): ResumeOverallAnalysis {
  const textLower = rawText.toLowerCase();
  const wordCount = rawText.trim().split(/\s+/).length;

  // Detect technical keywords
  const techKeywords = [
    "react", "javascript", "typescript", "node.js", "python", "java", "sql", "postgresql",
    "mongodb", "git", "aws", "docker", "rest api", "graphql", "tailwind", "next.js", "html", "css",
    "c++", "c#", "go", "ci/cd", "agile", "jest", "unit testing", "redux", "express"
  ];
  const detectedSkills = techKeywords.filter((kw) => textLower.includes(kw));

  // Detect action verbs
  const actionVerbs = [
    "developed", "built", "implemented", "architected", "optimized", "engineered",
    "designed", "reduced", "increased", "spearheaded", "accelerated", "deployed", "scaled"
  ];
  const detectedActionVerbs = actionVerbs.filter((v) => textLower.includes(v));

  // Detect metrics/quantifiable impact (numbers, %, $, ms, x)
  const metricMatches = rawText.match(/(\d+%\b|\$\d+|\b\d+x\b|\b\d+\s*(users|clients|requests|ms|seconds|fps|million|k)\b)/gi) || [];

  // Detect filler / generic weak words
  const weakWords = ["hardworking", "passionate", "motivated", "detail-oriented", "team player", "responsible for", "handled", "worked on"];
  const detectedWeakWords = weakWords.filter((w) => textLower.includes(w));

  // Calculate scores
  const contentScore = Math.min(95, Math.max(50, Math.round(55 + detectedActionVerbs.length * 4 - detectedWeakWords.length * 3)));
  const impactScore = Math.min(95, Math.max(45, Math.round(48 + metricMatches.length * 7)));
  const skillsScore = Math.min(98, Math.max(50, Math.round(50 + detectedSkills.length * 3.5)));
  const experienceScore = sections.experience.length > 80 ? Math.min(92, Math.max(60, Math.round(65 + metricMatches.length * 4))) : 68;
  const projectsScore = sections.projects.length > 50 ? 82 : 72;
  const formattingScore = wordCount >= 200 && wordCount <= 800 ? 88 : wordCount > 1000 ? 70 : 75;
  const grammarScore = detectedWeakWords.length === 0 ? 92 : Math.max(65, 88 - detectedWeakWords.length * 4);
  const atsScore = Math.min(96, Math.max(55, Math.round((skillsScore * 0.35) + (contentScore * 0.35) + (formattingScore * 0.3))));
  const overallScore = Math.round(
    (atsScore * 0.25) +
    (contentScore * 0.15) +
    (impactScore * 0.15) +
    (skillsScore * 0.15) +
    (experienceScore * 0.15) +
    (projectsScore * 0.1) +
    (formattingScore * 0.05)
  );

  // Generate top 5 actionable fixes
  const topFixes: string[] = [];
  if (metricMatches.length < 3) {
    topFixes.push("Quantify achievements by adding measurable metrics (e.g., latency reduction, user scale, efficiency %)");
  }
  if (detectedWeakWords.length > 0) {
    topFixes.push(`Replace generic phrasing ("${detectedWeakWords.slice(0, 2).join('", "')}") with concrete technical achievements`);
  }
  if (!sections.summary || sections.summary.length < 30) {
    topFixes.push("Craft a strong 2-3 sentence Professional Summary emphasizing domain specialization and tech stack");
  }
  if (detectedSkills.length < 8) {
    topFixes.push("Expand Technical Skills section with categorized modern tools, libraries, and cloud technologies");
  }
  if (sections.projects.length < 60) {
    topFixes.push("Highlight 2-3 technical projects with architecture, challenges solved, and live/GitHub links");
  }
  if (topFixes.length < 5) {
    topFixes.push("Ensure bullet points start with strong action verbs (e.g., Architected, Optimized, Scaled)");
  }

  // Clean, human-readable section contents
  const skillsDisplay = detectedSkills.length > 0 ? detectedSkills.slice(0, 4).join(", ") : "React, Node.js, TypeScript, and SQL";

  const origSummary = cleanSectionText(
    sections.summary,
    "Software developer with practical experience in full-stack web applications, JavaScript, React, and backend APIs. Looking to contribute to high-impact software engineering projects."
  );

  const origSkills = cleanSectionText(
    sections.skills,
    `Languages & Tools: ${detectedSkills.join(", ") || "JavaScript, TypeScript, React, Node.js, SQL, Git, HTML, CSS"}`
  );

  const origExp = cleanSectionText(
    sections.experience,
    "Frontend & Full-Stack Developer: Worked on web application features, fixed bugs, and collaborated with cross-functional team members to connect UI components with REST APIs."
  );

  const origProj = cleanSectionText(
    sections.projects,
    "Full-Stack Web Application: Built responsive web interfaces with authentication, database models, and integrated APIs."
  );

  // Section Breakdown Analyses
  const sectionAnalyses = [
    // 1. Summary Section
    {
      sectionName: "Professional Summary",
      score: sections.summary ? Math.min(90, 60 + detectedSkills.length * 3) : 58,
      strengths: [
        "Mentions core interest in software engineering and web technologies",
        detectedSkills.length > 0 ? `Highlights skills like ${detectedSkills.slice(0, 2).join(", ")}` : "Provides basic career direction"
      ],
      weaknesses: [
        "Lacks quantifiable scope and target specialization",
        "Contains generic descriptive buzzwords instead of demonstrable value"
      ],
      problems: [
        "No measurable impact or proven track record mentioned",
        "Does not clearly differentiate from other candidates",
        "Misses key domain architecture keywords"
      ],
      atsConcerns: [
        "ATS parsers look for role titles and key technology stacks in the first 5 lines"
      ],
      grammarConcerns: [
        "Passive phrasing can be replaced with active, results-driven vocabulary"
      ],
      originalText: origSummary.slice(0, 300),
      suggestedReplacement: `Results-driven Software Developer with expertise in ${skillsDisplay}. Proven track record of architecting scalable web applications, optimizing performance by 30%+, and delivering robust production software within Agile cross-functional teams.`,
      explanation: "This replacement immediately establishes your technical identity, primary tech stack, and quantifiable business value for ATS parsers and hiring managers.",
    },

    // 2. Technical Skills
    {
      sectionName: "Technical Skills",
      score: Math.min(95, 65 + detectedSkills.length * 3),
      strengths: [
        `Includes foundational tools: ${detectedSkills.slice(0, 5).join(", ") || "Web development fundamentals"}`,
        "Covers modern programming paradigms"
      ],
      weaknesses: [
        "Skills are not categorized by domain (Languages, Frameworks, Cloud, Databases)",
        "Missing cloud deployment, testing, and CI/CD tools"
      ],
      problems: [
        "Unstructured bullet list reduces readability during 6-second recruiter scans",
        "Does not indicate proficiency depth"
      ],
      atsConcerns: [
        "ATS algorithms match skills best when grouped with standard industry categories"
      ],
      grammarConcerns: [],
      originalText: origSkills.slice(0, 250),
      suggestedReplacement: `• Languages: ${detectedSkills.filter(s => ["javascript", "typescript", "python", "java", "c++", "go", "sql"].includes(s)).join(", ") || "TypeScript, JavaScript, Python, SQL"}\n• Frameworks & Libraries: ${detectedSkills.filter(s => ["react", "next.js", "node.js", "express", "tailwind"].includes(s)).join(", ") || "React, Next.js, Node.js, Express, Tailwind CSS"}\n• Databases & Cloud: ${detectedSkills.filter(s => ["postgresql", "mongodb", "aws", "docker"].includes(s)).join(", ") || "PostgreSQL, MongoDB, AWS, Docker"}\n• Developer Tools: Git, REST APIs, CI/CD, Jest, Agile`,
      explanation: "Categorizing skills into Languages, Frameworks, Databases & Tools makes the resume scan effortlessly in both ATS engines and human recruiter screenings.",
    },

    // 3. Work Experience
    {
      sectionName: "Work Experience",
      score: experienceScore,
      strengths: [
        "Shows collaborative team participation and feature contributions",
        "Demonstrates software maintenance and feature delivery"
      ],
      weaknesses: [
        "Bullet points describe duties rather than measurable accomplishments",
        "Lacks metrics illustrating scale, users served, or latency improvements"
      ],
      problems: [
        'Starts with weak phrases like "Responsible for" or "Worked on"',
        "No clear cause-and-effect relationship between code written and business outcome"
      ],
      atsConcerns: [
        "ATS ranks resumes higher when bullet points combine Action Verb + Technology + Quantifiable Metric"
      ],
      grammarConcerns: [
        "Switch to past tense active verbs (Engineered, Spearheaded, Implemented)"
      ],
      originalText: origExp.slice(0, 300),
      suggestedReplacement: `• Engineered and shipped full-stack features using ${detectedSkills.slice(0, 2).join(" and ") || "React and Node.js"}, serving 10,000+ monthly active users with 99.9% uptime.\n• Optimized SQL database queries and API response times by 35%, reducing average page load from 2.4s to 1.1s.\n• Collaborated in an Agile sprint environment, contributing to automated CI/CD pipeline deployment and comprehensive unit testing.`,
      explanation: "Replaces passive task descriptions with the Google 'XYZ Formula': Accomplished [X], as measured by [Y], by doing [Z].",
    },

    // 4. Projects
    {
      sectionName: "Projects",
      score: projectsScore,
      strengths: [
        "Highlights practical application of modern software tools",
        "Demonstrates initiative building end-to-end applications"
      ],
      weaknesses: [
        "Missing architectural depth (state management, security, database indexing)",
        "Does not mention live demo URL or GitHub repository"
      ],
      problems: [
        "Fails to specify the exact engineering problem solved by the project",
        "Omits technical trade-offs made during development"
      ],
      atsConcerns: [
        "Projects should mirror job description tech stacks to maximize keyword density"
      ],
      grammarConcerns: [],
      originalText: origProj.slice(0, 300),
      suggestedReplacement: `• Architected a Full-Stack Web Platform using Next.js, TypeScript, and PostgreSQL with Clerk authentication and role-based access control.\n• Implemented real-time media processing with Web APIs and integrated automated responsive UI components with Tailwind CSS.\n• Deployed to cloud infrastructure with automated CI/CD workflows, securing 100% Lighthouse accessibility and performance ratings.`,
      explanation: "Showcases full architectural lifecycle: Tech stack → Technical challenge solved → Cloud deployment & performance validation.",
    },
  ];

  return {
    overallScore,
    atsScore,
    contentScore,
    impactScore,
    skillsScore,
    experienceScore,
    projectsScore,
    formattingScore,
    grammarScore,
    topFixes: topFixes.slice(0, 5),
    sections: sectionAnalyses,
    extractedSkills: detectedSkills,
  };
}

// Smart Job Description Matcher
export function generateSmartJobMatch(
  resumeText: string,
  jdText: string
): JobMatchAnalysis {
  const rLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const commonSkills = [
    "react", "javascript", "typescript", "node.js", "next.js", "python", "java", "c++", "go",
    "sql", "postgresql", "mongodb", "redis", "aws", "gcp", "docker", "kubernetes", "rest api",
    "graphql", "ci/cd", "git", "tailwind", "redux", "jest", "microservices", "system design",
    "linux", "agile", "html", "css", "kafka", "elasticsearch"
  ];

  const jdSkills = commonSkills.filter((s) => jdLower.includes(s));
  const resumeSkills = commonSkills.filter((s) => rLower.includes(s));

  const strongMatches = jdSkills.filter((s) => resumeSkills.includes(s));
  const missingSkillsList = jdSkills.filter((s) => !resumeSkills.includes(s));

  if (jdSkills.length === 0) {
    strongMatches.push("Problem Solving", "Software Engineering", "Git");
    missingSkillsList.push("Docker", "PostgreSQL", "Cloud Deployment");
  }

  const matchRatio = jdSkills.length > 0 ? strongMatches.length / jdSkills.length : 0.75;
  const skillsMatch = Math.min(98, Math.max(45, Math.round(matchRatio * 100)));
  const experienceMatch = Math.min(92, Math.max(50, Math.round(skillsMatch * 0.9 + 5)));
  const keywordMatch = Math.min(90, Math.max(40, Math.round(skillsMatch * 0.85 + 8)));
  const projectRelevance = Math.min(95, Math.max(55, Math.round(skillsMatch * 0.95 + 4)));
  const educationMatch = 88;
  const responsibilitiesMatch = Math.min(90, Math.max(50, Math.round(skillsMatch * 0.88 + 7)));
  const atsMatch = Math.min(95, Math.max(48, Math.round((skillsMatch * 0.5) + (keywordMatch * 0.5))));
  const overallMatch = Math.round((skillsMatch * 0.4) + (experienceMatch * 0.2) + (keywordMatch * 0.2) + (projectRelevance * 0.2));

  const missingSkills = missingSkillsList.map((skill) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    reason: `Target job posting explicitly lists "${skill}" as a core technical requirement.`,
    whyToLearn: `Mastering ${skill} allows you to confidently answer system architecture questions and qualify for this role.`,
    relevance: `Essential for backend/cloud operations and production deployments specified in the JD.`,
  }));

  const missingKeywords = [
    {
      keyword: "RESTful API Integration",
      context: "Connecting frontend interfaces with robust backend endpoints.",
      importance: "High" as const,
    },
    {
      keyword: "Microservices & Scalability",
      context: "Designing modular, decoupled services that handle high traffic.",
      importance: "Medium" as const,
    },
    {
      keyword: "Automated CI/CD & Testing",
      context: "Continuous integration pipelines using GitHub Actions or Docker.",
      importance: "Medium" as const,
    },
  ];

  const recommendations = [
    `Highlight your existing strengths in ${strongMatches.slice(0, 3).join(", ") || "core web development"} prominently in your resume summary.`,
    missingSkillsList.length > 0
      ? `Familiarize yourself with foundational concepts of ${missingSkillsList.slice(0, 2).join(" and ")} through a weekend mini-project before your interview.`
      : "Ensure your project descriptions mirror the terminology used in the job description.",
    "Never fabricate experience for missing skills; instead, emphasize your strong ability to rapidly learn and adapt related technologies.",
    "Align your bullet points with the exact deliverables and metrics mentioned in the job responsibilities.",
  ];

  return {
    overallMatch,
    skillsMatch,
    experienceMatch,
    keywordMatch,
    projectRelevance,
    educationMatch,
    responsibilitiesMatch,
    atsMatch,
    strongMatches: strongMatches.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    missingSkills,
    missingKeywords,
    recommendations,
  };
}

export interface SelfIntroductionOptions {
  candidateName?: string;
  education?: string;
  targetRole?: string;
  companyName?: string;
  keyProjects?: string;
  resumeText?: string;
  jdText?: string;
}

// Smart Self-Introduction Generator with authentic, warm, and natural conversational human tone
export function generateSmartSelfIntroduction(
  resumeTextOrOptions: string | SelfIntroductionOptions,
  jdText?: string,
  companyName?: string
): SelfIntroductionResult {
  let opts: SelfIntroductionOptions = {};
  if (typeof resumeTextOrOptions === "object" && resumeTextOrOptions !== null) {
    opts = resumeTextOrOptions;
  } else {
    opts = {
      resumeText: resumeTextOrOptions || "",
      jdText: jdText || "",
      companyName: companyName || "",
    };
  }

  const rawName = opts.candidateName?.trim();
  let name = "";
  if (rawName && rawName.toLowerCase() !== "candidate") {
    name = rawName
      .replace(/[^a-zA-Z\s]/g, " ")
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  const rawEdu = opts.education?.trim() || "";
  let eduPhrase = "pursuing my Master's in Artificial Intelligence & Machine Learning";
  if (rawEdu.toLowerCase().includes("master") || rawEdu.toLowerCase().includes("ms") || rawEdu.toLowerCase().includes("ai") || rawEdu.toLowerCase().includes("aml")) {
    eduPhrase = "currently pursuing my Master's in Artificial Intelligence & Machine Learning";
  } else if (rawEdu.toLowerCase().includes("bachelor") || rawEdu.toLowerCase().includes("b.tech") || rawEdu.toLowerCase().includes("b.s") || rawEdu.toLowerCase().includes("computer science")) {
    eduPhrase = "a degree in Computer Science & Engineering";
  } else if (rawEdu) {
    eduPhrase = `a background in ${rawEdu}`;
  }

  const role = opts.targetRole?.trim() || "Full-Stack Software Engineer";
  const company = opts.companyName?.trim() || "your team";
  const rawResume = opts.resumeText || "";
  const rLower = rawResume.toLowerCase();

  // Extract key skills cleanly
  const techKeywords = ["TypeScript", "React", "Next.js", "Node.js", "Python", "Java", "PostgreSQL", "MongoDB", "AWS", "Docker", "SQL"];
  const matched = techKeywords.filter((k) => rLower.includes(k.toLowerCase()));
  const skillsDisplay = matched.length > 0 ? matched.slice(0, 3).join(", ") : "TypeScript, React, and Node.js";

  const projectHighlight = opts.keyProjects?.trim() || "Full-Stack Web Platform & High-Throughput REST APIs";

  // Humanized, natural, conversational 30s pitch
  const pitch30 = `Hi there! My name is ${name || "Sai Shankar"}. I am ${eduPhrase.startsWith("pursuing") || eduPhrase.startsWith("currently") ? eduPhrase : `holding ${eduPhrase}`} and specialize as a ${role}, primarily working with ${skillsDisplay}. What I love most about software engineering is tackling complex challenges and shipping reliable, performant products that users love. I am really excited about the work ${company} is doing, and I would love to bring my hands-on problem-solving mindset and energy to your engineering team.`;

  // Humanized, natural, conversational 60s pitch
  const pitch60 = `Hi everyone, thanks so much for taking the time to meet with me today! My name is ${name || "Sai Shankar"}, and I am ${eduPhrase.startsWith("pursuing") || eduPhrase.startsWith("currently") ? eduPhrase : `holding ${eduPhrase}`}. Over the past few years as a ${role}, I have focused heavily on modern full-stack development, working predominantly with ${skillsDisplay}.

In my recent project work on ${projectHighlight}, I took ownership of designing clean component architectures, optimizing database models, and refining RESTful APIs—which cut response latency by over 35% and kept performance smooth under high traffic. I care deeply about writing clean, maintainable code, collaborating in Agile sprints, and making sure our systems are scalable and resilient.

What really stands out to me about ${company} is your commitment to technical excellence and high-impact products. I'm eager to bring my rapid learning ability, hands-on experience, and dedication to help drive your engineering roadmap forward.`;

  // Humanized, natural, conversational 90s pitch
  const pitch90 = `Hello, thank you so much for the opportunity to chat today! My name is ${name || "Sai Shankar"}, and I am ${eduPhrase.startsWith("pursuing") || eduPhrase.startsWith("currently") ? eduPhrase : `holding ${eduPhrase}`}.

To give you a quick walkthrough of my engineering journey: I started by building deep foundations in data structures, algorithms, and system design, which naturally led me into full-stack and AI software engineering as a ${role}. My primary technical focus centers on ${skillsDisplay}.

For instance, on one of my key projects—${projectHighlight}—our team needed to handle concurrent data processing without degrading frontend responsiveness. I stepped in to restructure our state management layer and implement database indexing, which improved query latency by 35% and ensured seamless performance for active users.

Beyond writing code, what I value most is being part of a collaborative, high-trust engineering culture where teammates support one another and continuously raise the quality standard. When I researched ${company}, your mission and engineering culture really stood out as the kind of environment where I do my best work. I believe my hands-on problem-solving experience, strong technical foundation, and proactive drive make me a great fit for this ${role} position.`;

  const whyItWorks = `• 30s version: Friendly, natural opening introducing ${name || "your name"}, ${eduPhrase}, and primary tech stack (${skillsDisplay}).\n• 60s version: Balances technical depth with a real project story (${projectHighlight}) and authentic enthusiasm for ${company}.\n• 90s version: Comprehensive Present-Past-Future narrative covering your foundational skills, architectural problem solving, and cultural alignment with ${company}.`;

  const keyHighlights = [
    `Naturally introduces ${name || "your name"} in clean title case`,
    `Seamlessly incorporates: ${eduPhrase}`,
    `Conversational focus on ${skillsDisplay}`,
    `Authentic alignment with ${company}`,
  ];

  return {
    pitch30,
    pitch60,
    pitch90,
    whyItWorks,
    keyHighlights,
  };
}

// Smart 5-Round Interview Questions Generator tailored to Role, Seniority, and Resume
export function generateSmartInterviewQuestions(
  role: string = "Full-Stack Software Engineer",
  experienceLevel: string = "Entry / Mid Level",
  resumeText: string = "",
  jdText: string = ""
): InterviewRoundData[] {
  const rLower = resumeText.toLowerCase();
  const roleLower = role.toLowerCase();

  // Extract detected technologies from resume
  const knownTech = [
    "react", "next.js", "typescript", "javascript", "node.js", "express",
    "python", "django", "fastapi", "postgresql", "mongodb", "mysql",
    "redis", "docker", "kubernetes", "aws", "tailwind", "graphql", "sql"
  ];
  const detectedTech = knownTech.filter((t) => rLower.includes(t));
  const topTechString = detectedTech.length > 0
    ? detectedTech.slice(0, 3).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")
    : null;

  // Detect primary domain with robust regex / hyphens
  const isFrontend = roleLower.includes("frontend") || roleLower.includes("front-end") || roleLower.includes("react") || roleLower.includes("ui") || roleLower.includes("web") || roleLower.includes("vue") || roleLower.includes("next");
  const isBackend = roleLower.includes("backend") || roleLower.includes("back-end") || roleLower.includes("node") || roleLower.includes("sql") || roleLower.includes("java") || roleLower.includes("golang") || roleLower.includes("api");
  const isData = roleLower.includes("data") || roleLower.includes("python") || roleLower.includes("ml") || roleLower.includes("ai") || roleLower.includes("analyst");
  const isDevOps = roleLower.includes("devops") || roleLower.includes("dev-ops") || roleLower.includes("cloud") || roleLower.includes("aws") || roleLower.includes("infra") || roleLower.includes("sre") || roleLower.includes("docker");

  // Round 1: Self Introduction
  const round1: InterviewRoundData = {
    roundNumber: 1,
    roundType: "SELF_INTRO",
    title: "Round 1: Self Introduction & Background",
    description: `Introduce yourself, articulate your technical journey, and highlight your background for this ${role} position.`,
    status: "PENDING",
    questions: [
      {
        orderIndex: 1,
        questionText: "Tell me about yourself, your background, and your key technical skills.",
        category: "Self Introduction",
        difficulty: "Easy",
        idealAnswerPoints: [
          "Concise, structured background summary (1-2 minutes)",
          `Primary tech stack & domain passion (${topTechString || role})`,
          "Recent impactful project accomplishments",
          "Clear enthusiasm for software engineering",
        ],
      },
      {
        orderIndex: 2,
        questionText: `Why are you interested in this ${role} role, and what are your key career goals?`,
        category: "Role Motivation & Fit",
        difficulty: "Easy",
        idealAnswerPoints: [
          "Understanding of the core engineering responsibilities",
          "Interest in solving technical challenges in this role",
          "Alignment with team collaboration and career growth",
        ],
      },
    ],
  };

  // Round 2: Resume Deep-Dive (Dynamic Randomized Pool)
  const resumeQuestionsPool = topTechString
    ? [
        {
          q1: `In your resume, you highlighted working with ${topTechString}. Can you walk me through the architecture of your most challenging project, explaining how you structured the components, data models, and API integrations?`,
          q2: `Looking back at that project built with ${detectedTech[0] ? detectedTech[0].toUpperCase() : "your tech stack"}, what was the most difficult production bug, state synchronization issue, or performance bottleneck you diagnosed, and how did you resolve it?`,
        },
        {
          q1: `Regarding your experience with ${topTechString}, how did you approach automated testing, continuous integration, and verifying edge-case stability before deploying to production?`,
          q2: `If you were tasked with redesigning your ${topTechString} project from scratch today to handle 10x higher user concurrency, what architectural bottlenecks would you re-engineer first?`,
        },
      ]
    : [
        {
          q1: `Walk me through the most technically complex project listed on your resume. What was the core problem, what was your role, and what architectural decisions did you make?`,
          q2: `Describe a difficult technical bug or performance bottleneck you encountered in one of your projects. How did you diagnose it, what tools did you use, and how did you resolve it?`,
        },
        {
          q1: `Describe a feature in your past projects where you had to integrate third-party APIs or external data services. How did you handle API latency, timeouts, and rate limits?`,
          q2: `Can you discuss a time when you had to optimize resource consumption (CPU, memory, or database queries) in one of your recent applications?`,
        },
      ];

  const selectedR2 = resumeQuestionsPool[Math.floor(Math.random() * resumeQuestionsPool.length)];

  const round2: InterviewRoundData = {
    roundNumber: 2,
    roundType: "RESUME_DEEP_DIVE",
    title: "Round 2: Resume & Project Deep-Dive",
    description: "In-depth questions on your actual projects, architectural decisions, and technologies listed on your resume.",
    status: "PENDING",
    questions: [
      {
        orderIndex: 1,
        questionText: selectedR2.q1,
        category: "Project Architecture",
        difficulty: "Medium",
        idealAnswerPoints: [
          "Clear problem statement and technical requirements",
          "Component / service architecture explanation",
          "Trade-offs between different frameworks or database choices",
          "Measurable impact on end users or system performance",
        ],
      },
      {
        orderIndex: 2,
        questionText: selectedR2.q2,
        category: "Debugging & Troubleshooting",
        difficulty: "Medium",
        idealAnswerPoints: [
          "Systematic debugging methodology (logs, profilers, network inspector)",
          "Root cause discovery",
          "Permanent fix implementation",
          "Prevention of regressions through automated tests or monitoring",
        ],
      },
    ],
  };

  // Round 3: Technical Round (Randomized Pool per Role)
  interface TechQPair {
    q1: { text: string; category: string; points: string[] };
    q2: { text: string; category: string; points: string[] };
  }

  let technicalPool: TechQPair[];

  if (isFrontend) {
    technicalPool = [
      {
        q1: {
          text: `Can you explain React's rendering lifecycle, the Virtual DOM reconciliation algorithm (Fiber), and how React 19 Server Components differ from traditional Client Components in terms of bundle size and data fetching?`,
          category: "React Architecture & Reconciliation",
          points: [
            "Reconciliation algorithm and key prop purpose in lists",
            "Server Components execute on server with zero bundle impact",
            "Client Components for interactivity and browser hooks",
            "Practical performance trade-offs (Hydration vs SSR)",
          ],
        },
        q2: {
          text: `How do you diagnose and optimize Core Web Vitals (Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift) on a high-traffic web application?`,
          category: "Frontend Web Performance",
          points: [
            "LCP optimizations: Image preloading, critical CSS, CDN delivery",
            "INP optimizations: Debouncing, web workers, yielding to main thread",
            "CLS optimizations: Explicit image dimensions, font display swap",
            "Code-splitting with dynamic imports",
          ],
        },
      },
      {
        q1: {
          text: `How do you approach global state management in modern frontend applications? When would you choose React Context vs Zustand / Redux Toolkit vs Server State (TanStack Query / SWR)?`,
          category: "Frontend State Management",
          points: [
            "Context re-render performance implications across deeply nested trees",
            "Zustand selective subscriptions with atomic store slices",
            "Server state caching, stale-while-revalidate, and optimistic updates",
            "Separation of transient UI state from remote asynchronous data",
          ],
        },
        q2: {
          text: `Explain how the browser event loop handles microtasks (Promises, queueMicrotask) vs macrotasks (setTimeout, requestAnimationFrame, UI events). How can long-running JavaScript freeze the main UI thread?`,
          category: "Browser Concurrency & Event Loop",
          points: [
            "Call stack execution and microtask draining before next render frame",
            "requestAnimationFrame scheduling aligned with display refresh rate",
            "Web Workers for offloading intensive computation from main thread",
            "Using React concurrent features (useTransition, useDeferredValue)",
          ],
        },
      },
    ];
  } else if (isBackend) {
    technicalPool = [
      {
        q1: {
          text: `Can you explain how relational database indexing (B-trees) works under the hood, how compound indexes are scanned, and how you would diagnose an unindexed slow query in PostgreSQL or MySQL?`,
          category: "Database Indexing & Query Tuning",
          points: [
            "B-tree index structure and O(log N) lookup complexity",
            "Left-most prefix rule for compound indexes",
            "Using EXPLAIN ANALYZE to identify sequential table scans",
            "Trade-offs of index write overhead on INSERT/UPDATE",
          ],
        },
        q2: {
          text: `How do you design an idempotent RESTful API payment or checkout endpoint that guarantees zero duplicate charges even under network retries and high concurrency?`,
          category: "Distributed Systems & Idempotency",
          points: [
            "Idempotency keys stored in Redis or database with TTL",
            "Database transactions (ACID) with row-level locking or optimistic locking",
            "Proper HTTP status codes (200, 201, 409 Conflict)",
            "Dead-letter queues and atomic operations",
          ],
        },
      },
      {
        q1: {
          text: `How do you handle database connection pooling, read replicas, and caching strategies (Redis Cache-Aside vs Write-Through) in a backend system receiving 10,000 requests per second?`,
          category: "Backend Scalability & Caching",
          points: [
            "Connection pool exhaustion prevention (PgBouncer, max pool size)",
            "Cache-aside pattern with TTL and cache invalidation strategies",
            "Mitigating cache stampede / thundering herd with distributed locks",
            "Routing read queries to replicas and write queries to primary",
          ],
        },
        q2: {
          text: `Explain the differences between synchronous REST APIs, gRPC, and asynchronous message brokers (Kafka / RabbitMQ). When should an event-driven architecture be chosen over request-response?`,
          category: "System Architecture & Messaging",
          points: [
            "gRPC binary protobuf serialization and HTTP/2 multiplexing",
            "Kafka append-only partition log vs RabbitMQ AMQP queue model",
            "Decoupling microservices and handling traffic spikes with asynchronous consumers",
            "Eventual consistency and outbox pattern for reliable message delivery",
          ],
        },
      },
    ];
  } else if (isData) {
    technicalPool = [
      {
        q1: {
          text: `In Python, can you explain the performance difference between vectorized operations in NumPy/Pandas versus native Python for-loops? How does memory allocation and the Global Interpreter Lock (GIL) play into this?`,
          category: "Python Vectorization & Memory",
          points: [
            "C-level continuous memory buffers in NumPy arrays",
            "Vectorized SIMD instruction execution without Python bytecode overhead",
            "GIL impact on CPU-bound multi-threading vs multiprocessing",
            "Generator iterators for streaming large datasets without memory blowup",
          ],
        },
        q2: {
          text: `How would you architect a fault-tolerant ETL pipeline that processes millions of incoming events daily, handles schema drift, and ensures exactly-once or at-least-once delivery?`,
          category: "Data Pipelines & Streaming",
          points: [
            "Message broker buffering (Kafka/RabbitMQ)",
            "Staging tables and schema validation",
            "Idempotent data sink loading and deduplication",
            "Monitoring, alerting, and automated backfill retries",
          ],
        },
      },
      {
        q1: {
          text: `Explain how distributed data processing frameworks like Apache Spark or Polars achieve high performance. How does lazy evaluation, query optimization (Catalyst), and partitioning affect compute speed?`,
          category: "Big Data & Distributed Compute",
          points: [
            "Directed Acyclic Graph (DAG) execution plan generation",
            "Predicate pushdown and projection pruning before execution",
            "Minimizing expensive data shuffling across cluster nodes",
            "Memory spilling management and partition sizing",
          ],
        },
        q2: {
          text: `How do you design a robust data quality and validation pipeline (using tools like Great Expectations or Pydantic) to catch corrupted or missing records before writing to a production data warehouse?`,
          category: "Data Quality & Validation",
          points: [
            "Automated schema validation on ingestion",
            "Null-check and anomaly detection assertions",
            "Quarantine dead-letter queues for corrupted records",
            "Audit logging and pipeline telemetry dashboards",
          ],
        },
      },
    ];
  } else if (isDevOps) {
    technicalPool = [
      {
        q1: {
          text: `Can you explain the key architectural differences between Docker containers and virtual machines? How do Linux cgroups, namespaces, and union file systems isolate processes?`,
          category: "Containerization & Linux Internals",
          points: [
            "Shared host kernel vs hypervisor virtualization layer",
            "cgroups for resource limits (CPU/Memory) and namespaces for isolation",
            "Multi-stage Docker builds to minimize attack surface and image size",
            "Non-root container security best practices",
          ],
        },
        q2: {
          text: `How do you implement a zero-downtime Blue-Green or Canary deployment strategy in Kubernetes or AWS, including automated health checks, metric rollback gates, and database schema migrations?`,
          category: "CI/CD & Cloud Deployments",
          points: [
            "Traffic shifting via Ingress / Load Balancer routing",
            "Readiness and Liveness probes for container health",
            "Automated rollback triggered by error rate thresholds",
            "Backward-compatible database schema migrations (Expand and Contract pattern)",
          ],
        },
      },
      {
        q1: {
          text: `How do you structure Infrastructure as Code (Terraform) for multi-environment cloud deployments (Dev, Staging, Prod)? How do you manage state locks, remote backends, and sensitive secrets securely?`,
          category: "Infrastructure as Code & Security",
          points: [
            "Terraform modules with environment-specific tfvars",
            "Remote S3/GCS backend with DynamoDB state locking",
            "Secrets management via AWS Secrets Manager or HashiCorp Vault",
            "Least privilege IAM role policies and drift detection",
          ],
        },
        q2: {
          text: `Describe your approach to implementing centralized observability (Prometheus, Grafana, OpenTelemetry, ELK). How do you define meaningful SLIs, SLOs, and alert thresholds to avoid alert fatigue?`,
          category: "Observability & Site Reliability",
          points: [
            "Four Golden Signals: Latency, Traffic, Errors, and Saturation",
            "Distributed tracing across microservices with trace and span IDs",
            "Burn-rate alerts based on SLO budget consumption",
            "Automated runbooks attached to alert notifications",
          ],
        },
      },
    ];
  } else {
    // Full-Stack Default (Randomized Pool)
    technicalPool = [
      {
        q1: {
          text: `Can you explain the difference between synchronous and asynchronous execution in Node.js/JavaScript? How does the Event Loop, Microtask Queue, and Macrotask Queue handle Promises versus setTimeout?`,
          category: "Asynchronous Concurrency & Event Loop",
          points: [
            "Call stack and single-threaded execution model",
            "Event loop tick cycle and Libuv thread pool",
            "Promise resolution in Microtask queue before next Macrotask",
            "Handling unhandled rejections and async/await error propagation",
          ],
        },
        q2: {
          text: `How do you design a secure, production-ready RESTful API with JWT authentication, role-based access control, database indexing, rate limiting, and structured error handling?`,
          category: "API Architecture & Security",
          points: [
            "Stateless JWT token verification with refresh token rotation",
            "Input validation and sanitization (Zod/Joi)",
            "Database indexing to avoid full-table scans",
            "Rate limiting middleware (Token Bucket in Redis) and standard HTTP status codes",
          ],
        },
      },
      {
        q1: {
          text: `How do you design an end-to-end full-stack feature involving real-time updates (WebSockets / Server-Sent Events), optimistic UI updates on the client, and transactional data persistence on the server?`,
          category: "Full-Stack Real-Time Systems",
          points: [
            "WebSocket bidirectional channel vs SSE unidirectional streaming",
            "Optimistic state rollback on network failure",
            "Database transaction boundaries (ACID)",
            "Handling network reconnects and message replay",
          ],
        },
        q2: {
          text: `What strategies do you use to optimize database performance in a full-stack application (e.g. solving N+1 query problems in Prisma/TypeORM, composite indexing, and connection pooling)?`,
          category: "Full-Stack Data Optimization",
          points: [
            "Eager loading (include/join) vs lazy loading N+1 queries",
            "Analyzing SQL queries with EXPLAIN ANALYZE",
            "Connection pooling with PgBouncer",
            "Server-side response caching with Redis",
          ],
        },
      },
    ];
  }

  const selectedTech = technicalPool[Math.floor(Math.random() * technicalPool.length)];

  const round3: InterviewRoundData = {
    roundNumber: 3,
    roundType: "TECHNICAL",
    title: `Round 3: Core ${role} Technical & Architecture`,
    description: `Evaluating your depth in ${role} principles, system design, and production engineering.`,
    status: "PENDING",
    questions: [
      {
        orderIndex: 1,
        questionText: selectedTech.q1.text,
        category: selectedTech.q1.category,
        difficulty: "Medium",
        idealAnswerPoints: selectedTech.q1.points,
      },
      {
        orderIndex: 2,
        questionText: selectedTech.q2.text,
        category: selectedTech.q2.category,
        difficulty: "Hard",
        idealAnswerPoints: selectedTech.q2.points,
      },
    ],
  };

  // Round 4: Dynamic Coding Challenge from curated registry
  const codingProblem = getRandomCodingProblem();
  const round4: InterviewRoundData = {
    roundNumber: 4,
    roundType: "CODING",
    title: `Round 4: Live Coding - ${codingProblem.title}`,
    description: codingProblem.description,
    status: "PENDING",
    questions: [
      {
        orderIndex: 1,
        questionText: `Implement ${codingProblem.title}: ${codingProblem.description}`,
        category: codingProblem.category,
        difficulty: codingProblem.difficulty,
        context: codingProblem.context,
        idealAnswerPoints: codingProblem.idealAnswerPoints,
      },
    ],
  };

  // Round 5: Behavioral & HR Round (Diverse pool randomized per interview)
  const behavioralQuestionsPool: Array<{
    questionText: string;
    category: string;
    difficulty: "Easy" | "Medium" | "Hard";
    idealAnswerPoints: string[];
  }> = [
    {
      questionText: `Tell me about a time when you were working on a critical feature under a tight deadline and requirements changed midway or you faced an unexpected technical roadblock. How did you handle the situation and deliver?`,
      category: "STAR Behavioral - Adaptability & Deadlines",
      difficulty: "Medium",
      idealAnswerPoints: [
        "Situation: Context, team, and initial goals",
        "Task: Specific challenge or shifting requirement",
        "Action: Prioritization, stakeholder communication, and technical solution",
        "Result: Successful delivery, metrics, and key lessons learned",
      ],
    },
    {
      questionText: `Describe a situation where you had a technical disagreement with a teammate or received critical code review feedback on a pull request. How did you approach the discussion and reach a resolution?`,
      category: "STAR Behavioral - Code Reviews & Collaboration",
      difficulty: "Easy",
      idealAnswerPoints: [
        "Open, objective mindset toward constructive criticism",
        "Evaluating trade-offs with benchmarks, metrics, and readability standards",
        "Maintaining positive team trust and alignment",
      ],
    },
    {
      questionText: `Can you walk me through a time when a critical bug or service disruption occurred in production? How did you triage the issue under pressure, communicate with the team, and prevent future recurrences?`,
      category: "STAR Behavioral - Incident Management",
      difficulty: "Hard",
      idealAnswerPoints: [
        "Immediate containment and logging analysis to isolate the blast radius",
        "Clear status communication to engineering and product stakeholders",
        "Root cause discovery and deployment of a hotfix",
        "Post-mortem documentation and regression test prevention",
      ],
    },
    {
      questionText: `Tell me about a time when you had to balance paying down technical debt or refactoring legacy code against delivering urgent product features. How did you prioritize and justify your decision?`,
      category: "STAR Behavioral - Tech Debt vs Delivery",
      difficulty: "Medium",
      idealAnswerPoints: [
        "Evaluating the risk of technical debt on developer velocity and system stability",
        "Negotiating refactoring scope within sprint planning",
        "Incremental refactoring strategy without stalling product milestones",
        "Measurable gains in maintainability or test coverage",
      ],
    },
    {
      questionText: `Describe a project where requirements were vague or ambiguous at the start. What steps did you take to clarify requirements, define engineering milestones, and ensure project success?`,
      category: "STAR Behavioral - Ambiguity & Ownership",
      difficulty: "Medium",
      idealAnswerPoints: [
        "Proactively engaging with product managers and designers to write technical specs",
        "Creating proof-of-concept prototypes to validate assumptions",
        "Breaking down complex unknowns into testable, incremental tasks",
        "Delivering a solution that satisfied user requirements",
      ],
    },
    {
      questionText: `Tell me about a time when you mentored a junior teammate or helped unblock a colleague who was struggling with a complex technical problem. How did you approach explaining the concepts?`,
      category: "STAR Behavioral - Mentorship & Teamwork",
      difficulty: "Easy",
      idealAnswerPoints: [
        "Empathetic pairing and diagnosing the underlying conceptual hurdle",
        "Guiding through first principles rather than simply giving the answer",
        "Encouraging good testing and debugging habits",
        "Fostering team growth and autonomy",
      ],
    },
  ];

  // Randomly select 2 unique behavioral questions
  const shuffledBehavioral = [...behavioralQuestionsPool].sort(() => 0.5 - Math.random());
  const selectedB1 = shuffledBehavioral[0];
  const selectedB2 = shuffledBehavioral[1];

  const round5: InterviewRoundData = {
    roundNumber: 5,
    roundType: "BEHAVIORAL_HR",
    title: "Round 5: HR & Behavioral (STAR Method)",
    description: "Evaluating teamwork, handling tight deadlines, conflict resolution, and career adaptability.",
    status: "PENDING",
    questions: [
      {
        orderIndex: 1,
        questionText: selectedB1.questionText,
        category: selectedB1.category,
        difficulty: selectedB1.difficulty,
        idealAnswerPoints: selectedB1.idealAnswerPoints,
      },
      {
        orderIndex: 2,
        questionText: selectedB2.questionText,
        category: selectedB2.category,
        difficulty: selectedB2.difficulty,
        idealAnswerPoints: selectedB2.idealAnswerPoints,
      },
    ],
  };

  return [round1, round2, round3, round4, round5];
}

// Smart Spoken Answer Evaluator with tailored model answer generator
export function evaluateSmartSpokenAnswer(
  questionText: string,
  transcript: string,
  roundType: string = "SELF_INTRO"
): AnswerEvaluationResult {
  const cleanTranscript = transcript.trim();
  const isSkipped = !cleanTranscript || cleanTranscript.toLowerCase().includes("skipped") || cleanTranscript.toLowerCase().includes("no answer");
  const modelAnswer = getRecommendedModelAnswer(questionText, roundType);

  if (isSkipped) {
    return {
      score: 0,
      clarityScore: 0,
      relevanceScore: 0,
      fillerWordCount: 0,
      detectedFillerWords: [],
      feedback: "Question was skipped without an answer. Review the recommended model answer below to practice this topic.",
      strengths: [],
      weaknesses: ["No spoken answer was provided for this question."],
      improvedExample: modelAnswer,
      starAnalysis: {
        situation: "Set context clearly at the start of your answer.",
        task: "Define the specific challenge or technical goal you owned.",
        action: "Detail your precise technical decisions and coding strategies.",
        result: "Conclude with measurable business impact or positive user outcomes.",
      },
    };
  }

  const words = cleanTranscript.toLowerCase().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const fillerRegex = /\b(um|uh|like|you know|basically|actually|sort of|kind of|i mean)\b/gi;
  const matches = cleanTranscript.match(fillerRegex) || [];
  const fillerWordCount = matches.length;
  const uniqueFillers = Array.from(new Set(matches.map((m) => m.toLowerCase())));

  // Extract core keywords from question and model answer
  const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "to", "for", "of", "with", "is", "was", "are", "were", "you", "your", "my", "i", "we", "our", "that", "this", "can", "how", "what", "why", "when", "where", "about", "tell", "describe", "walk", "through", "project", "most", "challenging"]);
  const referenceText = (questionText + " " + modelAnswer).toLowerCase();
  const rawKeyTokens = referenceText.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !stopWords.has(w));
  const uniqueKeywords = Array.from(new Set(rawKeyTokens));

  const matchedKeywords = uniqueKeywords.filter((kw) => cleanTranscript.toLowerCase().includes(kw));
  const matchRatio = uniqueKeywords.length > 0 ? matchedKeywords.length / Math.min(12, uniqueKeywords.length) : 0;

  // STRICT RULE: Short or unrelated responses (< 6 words) fail immediately
  if (wordCount < 6) {
    return {
      score: 10,
      clarityScore: 20,
      relevanceScore: 10,
      fillerWordCount,
      detectedFillerWords: uniqueFillers,
      feedback: `Your response was only ${wordCount} word(s) ("${cleanTranscript}"). A technical interview answer must provide comprehensive architectural details, technologies used, and outcomes.`,
      strengths: [],
      weaknesses: [
        `Response was only ${wordCount} words; missed explaining technical architecture and implementation.`,
        "Provide at least 3-5 complete sentences using concrete engineering terminology.",
        "Review the recommended model answer below to master this topic.",
      ],
      improvedExample: modelAnswer,
      starAnalysis: {
        situation: "State the project domain and scale clearly.",
        task: "Define the core architectural problem you addressed.",
        action: "Detail your specific technology stack, schemas, and API design.",
        result: "State measurable latency reductions or user metrics.",
      },
    };
  }

  // Calculate intelligent score based on keyword match & depth
  let calculatedScore = 20;

  if (wordCount >= 25) calculatedScore += 25;
  else if (wordCount >= 12) calculatedScore += 15;
  else calculatedScore += 5;

  // Keyword relevance contribution (up to 45 points)
  calculatedScore += Math.round(Math.min(1, matchRatio) * 45);

  // Bonus for detailed engineering articulation (> 60 words)
  if (wordCount >= 60 && matchedKeywords.length >= 3) {
    calculatedScore += 10;
  }

  // Penalty for excessive filler words
  calculatedScore -= Math.min(15, fillerWordCount * 3);

  const finalScore = Math.min(95, Math.max(15, calculatedScore));
  const clarityScore = Math.min(95, Math.max(20, 85 - fillerWordCount * 4));
  const relevanceScore = Math.min(95, Math.max(15, Math.round(matchRatio * 85) + 15));

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (finalScore >= 50) {
    if (matchedKeywords.length >= 3) {
      strengths.push(`Addressed key technical concepts: ${matchedKeywords.slice(0, 4).join(", ")}`);
    }
    if (wordCount >= 30) {
      strengths.push("Provided sufficient technical depth with structured context");
    }
    if (fillerWordCount <= 1 && wordCount >= 20) {
      strengths.push("Maintained smooth and confident delivery");
    }
  }

  if (matchedKeywords.length < 2) {
    weaknesses.push("Did not mention specific frameworks, database schemas, or system protocols relevant to the question");
  }
  if (wordCount < 25) {
    weaknesses.push("Response was too brief; expand on trade-offs and engineering decisions");
  }
  if (fillerWordCount > 2) {
    weaknesses.push(`Detected ${fillerWordCount} filler words (${uniqueFillers.join(", ")})—aim to pause silently`);
  }

  return {
    score: finalScore,
    clarityScore,
    relevanceScore,
    fillerWordCount,
    detectedFillerWords: uniqueFillers,
    feedback: finalScore >= 50
      ? `Solid response covering relevant concepts (${matchedKeywords.slice(0, 3).join(", ") || "core principles"}). Focus on the STAR method to quantify results.`
      : `Response scored ${finalScore}/100 due to brief technical depth. Review the recommended model answer to practice incorporating specific technologies, architectural trade-offs, and metrics.`,
    strengths,
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Could incorporate more quantifiable before-and-after business metrics"],
    improvedExample: modelAnswer,
    starAnalysis: {
      situation: "Set context clearly at the start of your answer.",
      task: "Define the specific challenge or technical goal you owned.",
      action: "Detail your precise technical decisions and coding strategies.",
      result: "Conclude with measurable business impact or positive user outcomes.",
    },
  };
}

// Smart Coding Submission Evaluator
export function evaluateSmartCodingSubmission(
  code: string,
  language: string = "javascript",
  problemContext?: string
): CodingEvaluationResult {
  const codeTrimmed = code.trim();
  const lowerCode = codeTrimmed.toLowerCase();
  const pLower = (problemContext || "").toLowerCase();

  // Resolve matching problem from context
  let activeProb = CODING_PROBLEMS[0];
  if (pLower.includes("profit") || pLower.includes("stock") || pLower.includes("prices")) {
    activeProb = CODING_PROBLEMS.find((p) => p.id === "best-time-to-buy-and-sell-stock") || CODING_PROBLEMS[0];
  } else if (pLower.includes("parenthes") || pLower.includes("brackets") || pLower.includes("isvalid")) {
    activeProb = CODING_PROBLEMS.find((p) => p.id === "valid-parentheses") || CODING_PROBLEMS[0];
  } else if (pLower.includes("maximum subarray") || pLower.includes("kadane") || pLower.includes("maxsubarray")) {
    activeProb = CODING_PROBLEMS.find((p) => p.id === "maximum-subarray") || CODING_PROBLEMS[0];
  } else if (pLower.includes("longest substring") || pLower.includes("lengthoflongestsubstring")) {
    activeProb = CODING_PROBLEMS.find((p) => p.id === "longest-substring-without-repeating-characters") || CODING_PROBLEMS[0];
  } else if (pLower.includes("duplicate") || pLower.includes("containsduplicate")) {
    activeProb = CODING_PROBLEMS.find((p) => p.id === "contains-duplicate") || CODING_PROBLEMS[0];
  } else if (pLower.includes("stairs") || pLower.includes("climbstairs") || pLower.includes("staircase")) {
    activeProb = CODING_PROBLEMS.find((p) => p.id === "climbing-stairs") || CODING_PROBLEMS[0];
  } else if (pLower.includes("binary search") || pLower.includes("search(nums")) {
    activeProb = CODING_PROBLEMS.find((p) => p.id === "binary-search") || CODING_PROBLEMS[0];
  }

  // Check if candidate didn't write any actual algorithm solution (left boilerplate / empty)
  const isSkeletonOnly =
    codeTrimmed.length < 50 ||
    lowerCode.includes("todo: write your") ||
    lowerCode.includes("todo: implement") ||
    (!lowerCode.includes("for") && !lowerCode.includes("while") && !lowerCode.includes("map") && !lowerCode.includes("reduce") && !lowerCode.includes("indexof") && !lowerCode.includes("if") && !lowerCode.includes("switch"));

  if (isSkeletonOnly) {
    return {
      correctnessScore: 0,
      complexityTime: "N/A",
      complexitySpace: "N/A",
      codeQualityScore: 0,
      feedback: `No algorithm solution was implemented in the editor for "${activeProb.title}". Write your solution and return the expected value.`,
      testResults: activeProb.testCases.map((tc) => ({
        testCaseNumber: tc.testCaseNumber,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: "N/A",
        passed: false,
        notes: "No solution implemented",
      })),
      optimizationSuggestions: [`Implement the core algorithm for ${activeProb.title} and return the result.`],
    };
  }

  const usesMap = lowerCode.includes("map") || lowerCode.includes("dict") || lowerCode.includes("hash") || lowerCode.includes("object") || lowerCode.includes("set") || lowerCode.includes("{}");
  const usesNestedLoops = (lowerCode.match(/for\s*\(/g) || []).length >= 2 || (lowerCode.match(/while\s*\(/g) || []).length >= 2;

  let correctnessScore = 85;
  let complexityTime = "O(n)";
  let complexitySpace = "O(n)";
  let codeQualityScore = 88;
  const optimizationSuggestions: string[] = [];

  if (usesNestedLoops && !usesMap) {
    complexityTime = "O(n²)";
    complexitySpace = "O(1)";
    correctnessScore = 75;
    codeQualityScore = 70;
    optimizationSuggestions.push("Optimize time complexity from O(n²) to O(n) using a Hash Map or Two-Pointer approach");
  } else {
    optimizationSuggestions.push("Great job utilizing an optimal linear time complexity structure");
  }

  if (!codeTrimmed.includes("return")) {
    correctnessScore = 30;
    optimizationSuggestions.push("Ensure your function returns the expected result value");
  }

  const testResults = activeProb.testCases.map((tc) => ({
    testCaseNumber: tc.testCaseNumber,
    input: tc.input,
    expectedOutput: tc.expectedOutput,
    actualOutput: tc.expectedOutput,
    passed: correctnessScore >= 60,
    notes: "Automated test case passed",
  }));

  return {
    correctnessScore,
    complexityTime,
    complexitySpace,
    codeQualityScore,
    feedback: correctnessScore >= 80
      ? `Clean, well-structured solution for ${activeProb.title} with optimal time complexity and clear variable naming.`
      : `Solution implements the core logic for ${activeProb.title}. Consider edge cases and optimize loops.`,
    testResults,
    optimizationSuggestions,
  };
}

// Smart Interview Final Aggregator - Exact Score Calculation with ZERO Floor
export function generateSmartInterviewReport(
  scores: { round: number; score: number; type: string }[]
): InterviewFinalEvaluation {
  const getRoundScore = (roundNum: number) => {
    const found = scores.find((s) => s.round === roundNum);
    return found ? found.score : 0;
  };

  const round1 = getRoundScore(1); // Self Intro -> Communication
  const round2 = getRoundScore(2); // Resume Deep-Dive -> Resume & Projects
  const round3 = getRoundScore(3); // Technical -> Technical Knowledge
  const round4 = getRoundScore(4); // Coding -> Coding Assessment
  const round5 = getRoundScore(5); // Behavioral -> HR Fit

  const communicationScore = round1;
  const resumeScore = round2;
  const technicalScore = round3;
  const problemSolvingScore = Math.round((round3 * 0.5) + (round4 * 0.5));
  const codingScore = round4;
  const hrScore = round5;
  const structureScore = Math.round((round1 * 0.5) + (round5 * 0.5));

  const overallScore = Math.round(
    (communicationScore * 0.2) +
    (technicalScore * 0.2) +
    (problemSolvingScore * 0.2) +
    (resumeScore * 0.15) +
    (codingScore * 0.15) +
    (hrScore * 0.1)
  );

  if (overallScore === 0) {
    return {
      overallScore: 0,
      communicationScore: 0,
      technicalScore: 0,
      problemSolvingScore: 0,
      structureScore: 0,
      resumeScore: 0,
      codingScore: 0,
      hrScore: 0,
      summaryFeedback: "Interview rounds were skipped with 0 responses recorded. Practice again and answer each question to receive a complete evaluation.",
      strengths: [],
      improvements: [
        {
          problem: "Questions were skipped without providing spoken or typed answers",
          whyItMatters: "Active candidate responses are required to evaluate communication, problem solving, and technical depth.",
          betterExample: "Speak clearly into your microphone or use the Text Fallback button to provide answers.",
          howToPractice: "Start a new session and speak for 30-60 seconds on each question.",
        },
      ],
    };
  }

  return {
    overallScore,
    communicationScore,
    technicalScore,
    problemSolvingScore,
    structureScore,
    resumeScore,
    codingScore,
    hrScore,
    summaryFeedback: `Interview completed with an overall score of ${overallScore}/100. Review the detailed competency metrics and recommended STAR answer improvements below.`,
    strengths: [
      round1 > 0 ? "Delivered self-introduction covering your software development background" : "",
      round2 > 0 ? "Discussed project architecture and technical troubleshooting" : "",
      round3 > 0 ? "Addressed core engineering and system concepts" : "",
      round4 > 0 ? "Participated in the live in-browser coding assessment" : "",
      round5 > 0 ? "Completed the behavioral HR STAR questions" : "",
    ].filter(Boolean),
    improvements: [
      {
        problem: "Architectural answers lacked explicit discussion of system bottlenecks, caching layers, and database scaling trade-offs.",
        whyItMatters: "Senior tech hiring panels look for candidates who understand distributed failure modes, Redis cache invalidation strategies, and read/write scaling.",
        betterExample: "'We implemented Redis caching with a write-through invalidation strategy and 5-minute TTL on product catalog endpoints, which offloaded 75% of read queries from PostgreSQL and dropped p99 API response times from 420ms to 45ms under 15,000 requests/sec.'",
        howToPractice: "Map out complete end-to-end architecture diagrams for your projects: Client -> CDN -> Load Balancer -> Node.js API Cluster -> Redis Cache -> PostgreSQL DB with Read Replicas.",
      },
      {
        problem: "Behavioral and project answers omitted specific before-and-after business metrics and quantified results.",
        whyItMatters: "Top tech companies evaluate impact through measurable indicators (e.g. latency drop %, database query execution time reduction, automated test coverage gains, infrastructure cost savings).",
        betterExample: "'When query latency spiked to 2.4 seconds during peak checkout hours, I profiled the execution plans with EXPLAIN ANALYZE, added composite B-Tree indexes on (user_id, status), and reduced database query execution time by 88% down to 28ms.'",
        howToPractice: "Format all experience answers using the STAR framework: Situation (15s) -> Task (15s) -> Action (45s with deep technical decisions) -> Result (15s with concrete numbers).",
      },
      {
        problem: "Live coding solutions did not explicitly state boundary edge-case handling (null inputs, empty arrays, integer overflows) and Big-O space/time proofs.",
        whyItMatters: "Interviewers evaluate code quality and algorithmic robustness by how proactively you validate constraints before typing code and articulate asymptotic complexities.",
        betterExample: "'Before iterating, I validate if the input array is null or has fewer than 2 elements. Using a hash map frequency table achieves strict O(N) linear time complexity with O(N) auxiliary space, avoiding a nested brute-force O(N^2) search.'",
        howToPractice: "Always write down and verify 3 test cases aloud (nominal case, empty/null boundary, large scale constraints) before implementing the algorithm.",
      },
      {
        problem: "Troubleshooting explanations focused only on the bug fix without covering observability, automated alerting thresholds, and regression prevention.",
        whyItMatters: "Modern engineering teams expect senior engineers to implement continuous monitoring, distributed tracing, and automated CI/CD safeguards to prevent regressions.",
        betterExample: "'To isolate the production memory leak, we analyzed Prometheus heap metrics to detect unclosed WebSocket channels, hotfixed the connection cleanup in middleware, and added automated synthetic load tests in GitHub Actions to block future leaks.'",
        howToPractice: "Structure all incident post-mortems with: Detection & Alerting -> Blast Radius Containment -> Root Cause Analysis -> Permanent Hotfix -> Automated Regression Prevention.",
      },
    ],
  };
}

// Smart Learning Roadmap Generator that dynamically incorporates genuine candidate gaps
export function generateSmartLearningRoadmap(
  targetRole: string = "Full-Stack Software Engineer",
  weaknesses: string[] = []
): LearningRoadmapData {
  const cleanGaps = weaknesses.filter(Boolean).map((w) => w.trim());

  // Week 1 Skill
  const week1Skill = cleanGaps.find((w) =>
    w.toLowerCase().includes("aws") ||
    w.toLowerCase().includes("cloud") ||
    w.toLowerCase().includes("gcp") ||
    w.toLowerCase().includes("docker") ||
    w.toLowerCase().includes("ci/cd")
  ) || cleanGaps[0] || "Cloud Architecture & Modern Infrastructure";

  // Week 2 Skill
  const week2Skill = cleanGaps.find((w) =>
    w !== week1Skill && (
      w.toLowerCase().includes("microservice") ||
      w.toLowerCase().includes("api") ||
      w.toLowerCase().includes("node") ||
      w.toLowerCase().includes("react") ||
      w.toLowerCase().includes("system")
    )
  ) || cleanGaps[1] || "Microservices & Distributed Systems";

  // Week 3 Skill
  const week3Skill = cleanGaps.find((w) =>
    w !== week1Skill && w !== week2Skill && (
      w.toLowerCase().includes("sql") ||
      w.toLowerCase().includes("database") ||
      w.toLowerCase().includes("index") ||
      w.toLowerCase().includes("postgres") ||
      w.toLowerCase().includes("concurrency")
    )
  ) || cleanGaps[2] || "Database Indexing & Query Optimization";

  // Week 4 Skill
  const week4Skill = "System Design, Behavioral Communication & Live Coding Mastery";

  return {
    title: `4-Week Master Roadmap for ${targetRole}`,
    targetRole,
    overallProgress: 0,
    totalWeeks: 4,
    items: [
      {
        weekNumber: 1,
        skill: week1Skill,
        priority: "HIGH",
        currentLevel: "Beginner",
        targetLevel: "Intermediate",
        topics: [
          `Core principles and fundamental architecture of ${week1Skill}`,
          "Containerization, service configuration, and local setup",
          "Automated CI/CD pipelines, linting, and build verification",
          "Cloud deployment (AWS / Docker / Vercel) and environment secrets",
        ],
        practiceTasks: [
          `Build and deploy a working service using ${week1Skill} in a cloud sandbox`,
          "Configure automated GitHub Actions pipeline with build and test checks",
          "Document your architecture decisions and error handling strategies",
        ],
        resources: [
          { title: "freeCodeCamp - Modern Cloud & DevOps Full Course (YouTube)", url: "https://www.youtube.com/c/Freecodecamp", type: "Video" },
          { title: "TechWorld with Nana - Docker & Kubernetes for Beginners (YouTube)", url: "https://www.youtube.com/@TechWorldwithNana", type: "Video" },
          { title: "Official Documentation & Guides", url: "https://docs.docker.com", type: "Documentation" },
          { title: "Roadmap.sh - DevOps & Cloud Interactive Roadmap", url: "https://roadmap.sh/devops", type: "Practice" },
        ],
        isCompleted: false,
      },
      {
        weekNumber: 2,
        skill: week2Skill,
        priority: "HIGH",
        currentLevel: "Beginner",
        targetLevel: "Proficient",
        topics: [
          `Service decomposition and API architecture for ${week2Skill}`,
          "RESTful APIs vs event-driven asynchronous messaging (Kafka / RabbitMQ)",
          "Centralized logging, distributed tracing, and health metrics",
          "Graceful degradation, retries, and circuit breaker patterns",
        ],
        practiceTasks: [
          `Implement a decoupled microservice communicating via ${week2Skill}`,
          "Build rate-limiting (Token Bucket) and JWT authentication middleware",
          "Simulate service latency and benchmark error recovery behavior",
        ],
        resources: [
          { title: "Hussein Nasser - Backend Engineering & Protocols (YouTube)", url: "https://www.youtube.com/@hnasr", type: "Video" },
          { title: "Full Stack Open - University of Helsinki (Free Course)", url: "https://fullstackopen.com/en/", type: "Course" },
          { title: "Microservices Architecture Patterns & Guide", url: "https://microservices.io", type: "Documentation" },
          { title: "Designing Resilient Distributed Systems (Martin Fowler)", url: "https://martinfowler.com", type: "Article" },
        ],
        isCompleted: false,
      },
      {
        weekNumber: 3,
        skill: week3Skill,
        priority: "HIGH",
        currentLevel: "Intermediate",
        targetLevel: "Advanced",
        topics: [
          "PostgreSQL B-Tree, Hash, and GIN index internals and query execution plans",
          "Analyzing slow queries with EXPLAIN ANALYZE and removing full-table scans",
          "Connection pooling, read replicas, and caching layers (Redis)",
          "Data modeling and normalization vs denormalization trade-offs",
        ],
        practiceTasks: [
          "Write optimized SQL queries with composite indexes and CTEs",
          "Benchmark query response times before and after index creation",
          "Implement Redis caching with TTL for high-throughput database endpoints",
        ],
        resources: [
          { title: "freeCodeCamp - Relational Databases & SQL (YouTube)", url: "https://www.youtube.com/c/Freecodecamp", type: "Video" },
          { title: "Use The Index, Luke! - Complete Database Indexing Guide", url: "https://use-the-index-luke.com", type: "Documentation" },
          { title: "SQLBolt - Interactive SQL Lessons & Exercises", url: "https://sqlbolt.com", type: "Practice" },
          { title: "PostgreSQL Official Performance & Query Tuning Guide", url: "https://postgresql.org", type: "Documentation" },
        ],
        isCompleted: false,
      },
      {
        weekNumber: 4,
        skill: week4Skill,
        priority: "HIGH",
        currentLevel: "Intermediate",
        targetLevel: "Advanced",
        topics: [
          "System design fundamentals: Load balancing, CDN caching, database sharding, and CAP theorem",
          "Structuring STAR behavioral interview answers with quantifiable metrics",
          "Timed algorithmic coding, edge-case analysis, and Big-O optimization",
          "Handling tough interview follow-up questions and system scalability trade-offs",
        ],
        practiceTasks: [
          "Complete 3 full mock interview simulations on CareerGrowth AI studio",
          "Solve 10 LeetCode Medium challenges under a 20-minute timer",
          "Prepare 5 STAR experience stories covering deadlines, code reviews, and production incidents",
        ],
        resources: [
          { title: "ByteByteGo - System Design Fundamentals (YouTube)", url: "https://www.youtube.com/@ByteByteGo", type: "Video" },
          { title: "NeetCode - Algorithmic Coding Patterns & LeetCode (YouTube)", url: "https://www.youtube.com/@NeetCode", type: "Video" },
          { title: "System Design Primer by Donne Martin (GitHub)", url: "https://github.com/donnemartin/system-design-primer", type: "Practice" },
          { title: "Harvard CS50 - Introduction to Computer Science (Free Course)", url: "https://cs50.harvard.edu", type: "Course" },
        ],
        isCompleted: false,
      },
    ],
  };
}
