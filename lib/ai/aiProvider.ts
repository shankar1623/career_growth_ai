import {
  ResumeOverallAnalysis,
  JobMatchAnalysis,
  SelfIntroductionResult,
  InterviewRoundData,
  AnswerEvaluationResult,
  CodingEvaluationResult,
  InterviewFinalEvaluation,
  LearningRoadmapData,
} from "@/types";
import { parseResumeSections } from "@/lib/parsers/resumeParser";
import {
  generateSmartResumeAnalysis,
  generateSmartJobMatch,
  generateSmartSelfIntroduction,
  generateSmartInterviewQuestions,
  evaluateSmartSpokenAnswer,
  evaluateSmartCodingSubmission,
  generateSmartInterviewReport,
  generateSmartLearningRoadmap,
} from "@/lib/ai/smartFallbackProvider";
import { callGeminiAPI } from "@/lib/ai/geminiProvider";
import { callOllamaAPI } from "@/lib/ai/ollamaProvider";
import { callOpenRouterAPI } from "@/lib/ai/openrouterProvider";
import { callGroqAPI } from "@/lib/ai/groqProvider";

// AI Provider Router Helper
async function executeAIPrompt(prompt: string): Promise<string | null> {
  const provider = (process.env.AI_PROVIDER || "groq").toLowerCase();

  // 1. Groq (Ultra-fast, Qwen 27B / Llama 3.3 70B)
  if ((provider === "groq" || process.env.GROQ_API_KEY) && process.env.GROQ_API_KEY) {
    const res = await callGroqAPI(prompt);
    if (res) return res;
  }

  // 2. Gemini Free Tier
  if (provider === "gemini" && process.env.GEMINI_API_KEY) {
    const res = await callGeminiAPI(prompt);
    if (res) return res;
  }

  // 3. Local Ollama
  if (provider === "ollama") {
    const res = await callOllamaAPI(prompt);
    if (res) return res;
  }

  // 4. OpenRouter
  if (provider === "openrouter" && process.env.OPENROUTER_API_KEY) {
    const res = await callOpenRouterAPI(prompt);
    if (res) return res;
  }

  return null;
}

// Resilient JSON extractor that cleans markdown codeblocks and searches for json objects / arrays
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractJsonFromResponse<T = any>(response: string | null): T | null {
  if (!response) return null;
  let cleaned = response.trim();

  // Strip ```json ... ``` or ``` ... ```
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Search for the outermost JSON array [...] or object {...}
    const jsonMatch = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function analyzeResume(rawText: string): Promise<ResumeOverallAnalysis> {
  const parsedSections = parseResumeSections(rawText);

  try {
    const prompt = `You are a world-class Executive Resume Coach and ATS Specialist.
Analyze the following resume text carefully and return a valid JSON object matching this schema:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "contentScore": number (0-100),
  "impactScore": number (0-100),
  "skillsScore": number (0-100),
  "experienceScore": number (0-100),
  "projectsScore": number (0-100),
  "formattingScore": number (0-100),
  "grammarScore": number (0-100),
  "topFixes": string[],
  "sections": [
    {
      "sectionName": string,
      "score": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "problems": string[],
      "atsConcerns": string[],
      "grammarConcerns": string[],
      "originalText": string,
      "suggestedReplacement": string,
      "explanation": string
    }
  ]
}

Resume Text:
${rawText.slice(0, 3000)}`;

    const aiResponse = await executeAIPrompt(prompt);
    const parsed = extractJsonFromResponse<ResumeOverallAnalysis>(aiResponse);
    if (parsed && typeof parsed.overallScore === "number" && Array.isArray(parsed.sections)) {
      return parsed;
    }
  } catch (error) {
    console.warn("AI resume analysis failed, using smart fallback:", error);
  }

  return generateSmartResumeAnalysis(rawText, parsedSections);
}

export async function matchJobDescription(resumeText: string, jdText: string): Promise<JobMatchAnalysis> {
  try {
    const prompt = `Analyze this resume against the Job Description and return a valid JSON object:
{
  "overallMatch": number (0-100),
  "skillsMatch": number (0-100),
  "experienceMatch": number (0-100),
  "keywordMatch": number (0-100),
  "projectRelevance": number (0-100),
  "educationMatch": number (0-100),
  "responsibilitiesMatch": number (0-100),
  "atsMatch": number (0-100),
  "strongMatches": string[],
  "missingSkills": [
    { "skill": string, "reason": string, "whyToLearn": string, "relevance": string }
  ],
  "missingKeywords": [
    { "keyword": string, "context": string, "importance": "High" | "Medium" | "Low" }
  ],
  "recommendations": string[]
}

Resume Text:
${resumeText.slice(0, 2500)}

Job Description:
${jdText.slice(0, 2500)}`;

    const aiResponse = await executeAIPrompt(prompt);
    const parsed = extractJsonFromResponse<JobMatchAnalysis>(aiResponse);
    if (parsed && typeof parsed.overallMatch === "number" && Array.isArray(parsed.missingSkills)) {
      return parsed;
    }
  } catch (error) {
    console.warn("AI job matching failed, using smart fallback:", error);
  }

  return generateSmartJobMatch(resumeText, jdText);
}

export interface SelfIntroParams {
  candidateName?: string;
  education?: string;
  targetRole?: string;
  companyName?: string;
  keyProjects?: string;
  resumeText?: string;
  jdText?: string;
}

export async function generateSelfIntroduction(
  resumeTextOrParams: string | SelfIntroParams,
  jdText?: string,
  companyName?: string
): Promise<SelfIntroductionResult> {
  const params: SelfIntroParams =
    typeof resumeTextOrParams === "object"
      ? resumeTextOrParams
      : { resumeText: resumeTextOrParams, jdText, companyName };

  const candidateName = params.candidateName || "Sai Shankar";
  const education = params.education || "Master's in Artificial Intelligence & Machine Learning";
  const targetRole = params.targetRole || "Full-Stack Software Engineer";
  const company = params.companyName || "the engineering team";
  const resumeText = params.resumeText || "";
  const keyProjects = params.keyProjects || "";

  try {
    const prompt = `You are an expert career coach helping a candidate craft an authentic, natural, humanized, conversational self-introduction for a live video interview.
Candidate Info:
- Name: ${candidateName && candidateName.toLowerCase() !== "candidate" ? candidateName : "Sai Shankar"}
- Education: ${education}
- Target Role: ${targetRole}
- Target Company: ${company}
- Key Projects / Highlights: ${keyProjects || "Full-stack web applications & high-throughput REST APIs"}

CRITICAL WRITING GUIDELINES:
1. Speak in warm, confident, and conversational human English as if speaking aloud to a friendly interviewer.
2. DO NOT use the literal word "Candidate". Open naturally (e.g. "Hi there! My name is ${candidateName}...").
3. DO NOT sound like a robot or dump keyword lists. Mention technologies naturally.
4. Use natural transitions: "Recently on my project...", "What I enjoy most is...", "What really stands out to me about your team...".
5. Return strictly valid JSON format:
{
  "pitch30": string,
  "pitch60": string,
  "pitch90": string,
  "whyItWorks": string,
  "keyHighlights": string[]
}

Resume Text:
${resumeText.slice(0, 2000)}
${params.jdText ? `Target Job Description:\n${params.jdText.slice(0, 1000)}` : ""}`;

    const aiResponse = await executeAIPrompt(prompt);
    const parsed = extractJsonFromResponse<SelfIntroductionResult>(aiResponse);
    if (parsed && parsed.pitch30 && parsed.pitch60 && parsed.pitch90) {
      return parsed;
    }
  } catch (error) {
    console.warn("AI self introduction generation failed, using smart fallback:", error);
  }

  return generateSmartSelfIntroduction(params);
}

export async function generateInterviewQuestions(
  role: string = "Software Engineer",
  experienceLevel: string = "Entry / Mid Level",
  resumeText: string = "",
  jdText: string = ""
): Promise<InterviewRoundData[]> {
  try {
    const sessionSeed = Math.random().toString(36).substring(2, 9);
    const prompt = `You are a Principal Tech Hiring Manager and Interviewer.
Generate a fresh, unique, and highly customized 5-round mock interview tailored specifically to the candidate's target role, seniority level, and actual resume background.
Random Session Seed: ${sessionSeed} (Ensure varied, distinct questions every generation even for the same role).

Target Role: ${role}
Seniority / Experience Level: ${experienceLevel}
${resumeText ? `Candidate Resume Context (Extract real projects and tech from here):\n${resumeText.slice(0, 2000)}` : "Candidate has not uploaded a resume yet. Generate standard high-quality questions for this specific role."}
${jdText ? `Target Job Description Requirements:\n${jdText.slice(0, 1200)}` : ""}

Generate the 5 structured rounds with high precision:
Round 1: SELF_INTRO - 2 questions.
  - Q1: Direct opening self-introduction question: "Tell me about yourself, your background, and your key technical skills."
  - Q2: "Why are you interested in this ${role} role, and what are your key career goals?"

Round 2: RESUME_DEEP_DIVE - 2 questions.
  - Ask in-depth questions about specific project architectures, challenges, and tools extracted from the candidate's resume (or representative ${role} projects if no resume).
  - Q1: Walk through a key project architecture and technical decisions.
  - Q2: Troubleshoot a complex production bug, concurrency issue, or performance bottleneck.

Round 3: TECHNICAL - 2 deep technical questions testing core domain principles for ${role}:
  - If Frontend: React 19 / Server Components, DOM reconciliation, state management, CSS performance.
  - If Backend: Distributed systems, database indexing & query optimization, API design, caching, message queues.
  - If Python/Data: ETL pipelines, Pandas/NumPy vectorization, memory management, data structures.
  - If DevOps/Cloud: Docker, Kubernetes, CI/CD pipelines, cloud infra, zero-downtime deployments.
  - If Full-Stack: End-to-end API design, relational schema design, client-server sync, security/auth.

Round 4: CODING - 1 realistic coding challenge matching the role with clear problem statement, example inputs/outputs, constraints, and test guidance in the context field.

Round 5: BEHAVIORAL_HR - 2 STAR behavioral questions on dealing with shifting requirements, tight deadlines, constructive PR code reviews, and teamwork.

Return ONLY a strictly valid JSON array of 5 round objects:
[
  {
    "roundNumber": 1,
    "roundType": "SELF_INTRO",
    "title": "Round 1: Self Introduction & Background",
    "description": "Introduce yourself and articulate your technical background and career goals.",
    "status": "PENDING",
    "questions": [
      { "orderIndex": 1, "questionText": string, "category": string, "difficulty": "Easy", "idealAnswerPoints": string[] },
      { "orderIndex": 2, "questionText": string, "category": string, "difficulty": "Easy", "idealAnswerPoints": string[] }
    ]
  },
  {
    "roundNumber": 2,
    "roundType": "RESUME_DEEP_DIVE",
    "title": "Round 2: Resume & Project Deep-Dive",
    "description": "In-depth questions on your actual projects and architectural decisions.",
    "status": "PENDING",
    "questions": [
      { "orderIndex": 1, "questionText": string, "category": string, "difficulty": "Medium", "idealAnswerPoints": string[] },
      { "orderIndex": 2, "questionText": string, "category": string, "difficulty": "Medium", "idealAnswerPoints": string[] }
    ]
  },
  {
    "roundNumber": 3,
    "roundType": "TECHNICAL",
    "title": "Round 3: Core Technical & System Architecture",
    "description": "Evaluating your depth in ${role} principles, architecture, and system concepts.",
    "status": "PENDING",
    "questions": [
      { "orderIndex": 1, "questionText": string, "category": string, "difficulty": "Medium", "idealAnswerPoints": string[] },
      { "orderIndex": 2, "questionText": string, "category": string, "difficulty": "Hard", "idealAnswerPoints": string[] }
    ]
  },
  {
    "roundNumber": 4,
    "roundType": "CODING",
    "title": "Round 4: Live Algorithmic Coding Challenge",
    "description": "Live algorithm implementation in code editor.",
    "status": "PENDING",
    "questions": [
      {
        "orderIndex": 1,
        "questionText": string,
        "category": string,
        "difficulty": "Medium",
        "context": string,
        "idealAnswerPoints": string[]
      }
    ]
  },
  {
    "roundNumber": 5,
    "roundType": "BEHAVIORAL_HR",
    "title": "Round 5: HR & Behavioral (STAR Method)",
    "description": "Evaluating collaboration, problem resolution, and communication.",
    "status": "PENDING",
    "questions": [
      { "orderIndex": 1, "questionText": string, "category": "STAR Behavioral", "difficulty": "Medium", "idealAnswerPoints": string[] },
      { "orderIndex": 2, "questionText": string, "category": "Career Aspirations", "difficulty": "Easy", "idealAnswerPoints": string[] }
    ]
  }
]`;

    const aiResponse = await executeAIPrompt(prompt);
    const parsed = extractJsonFromResponse<InterviewRoundData[]>(aiResponse);
    if (parsed && Array.isArray(parsed) && parsed.length === 5) {
      return parsed;
    }
  } catch (error) {
    console.warn("AI question generation failed, using smart fallback:", error);
  }

  return generateSmartInterviewQuestions(role, experienceLevel, resumeText, jdText);
}

export async function evaluateSpokenAnswer(
  questionText: string,
  transcript: string,
  roundType: string = "SELF_INTRO"
): Promise<AnswerEvaluationResult> {
  const cleanTranscript = (transcript || "").trim();
  const isSkipped = !cleanTranscript || cleanTranscript.toLowerCase().includes("skipped") || cleanTranscript.toLowerCase().includes("no answer");

  if (isSkipped) {
    return evaluateSmartSpokenAnswer(questionText, transcript, roundType);
  }

  const wordCount = cleanTranscript.split(/\s+/).filter(Boolean).length;
  if (wordCount < 4) {
    // If answer is only 1-3 words, immediately apply strict failing evaluation
    return evaluateSmartSpokenAnswer(questionText, cleanTranscript, roundType);
  }

  try {
    const prompt = `You are a Principal Technical Interviewer evaluating a candidate's spoken response.
Strictly grade the technical accuracy, depth, and relevance of the User Answer against the Question.

CRITICAL SCORING RULES:
1. If the User Answer is very brief (under 10 words), gibberish, off-topic, or incorrect, assign a FAIL score between 0 and 20. Do NOT give fake strengths like "minimal filler words".
2. If the User Answer is detailed, accurately explains technical concepts, architecture, trade-offs, and outcomes, assign a score between 75 and 100.
3. Compare the candidate's keywords and depth against the expected engineering standards.

Return strictly valid JSON only matching this schema:
{
  "score": number (0-100),
  "clarityScore": number (0-100),
  "relevanceScore": number (0-100),
  "fillerWordCount": number,
  "detectedFillerWords": string[],
  "feedback": string (honest, constructive engineering feedback),
  "strengths": string[] (concrete strengths if deserved, or empty array if answer was deficient),
  "weaknesses": string[] (specific technical gaps and missing elements),
  "improvedExample": string (exemplary senior-level answer with code/architecture details),
  "starAnalysis": { "situation": string, "task": string, "action": string, "result": string }
}

Question: "${questionText}"
User Spoken Answer: "${cleanTranscript}"`;

    const aiResponse = await executeAIPrompt(prompt);
    const parsed = extractJsonFromResponse<AnswerEvaluationResult>(aiResponse);
    if (parsed && typeof parsed.score === "number" && parsed.improvedExample) {
      return parsed;
    }
  } catch (error) {
    console.warn("AI answer evaluation failed, using smart fallback:", error);
  }

  return evaluateSmartSpokenAnswer(questionText, cleanTranscript, roundType);
}

export async function evaluateCodingSubmission(
  code: string,
  language: string = "javascript",
  context?: string
): Promise<CodingEvaluationResult> {
  try {
    const prompt = `Review this coding solution in ${language} and return a JSON object:
{
  "correctnessScore": number (0-100),
  "complexityTime": string (e.g. "O(n)"),
  "complexitySpace": string (e.g. "O(1)"),
  "codeQualityScore": number (0-100),
  "feedback": string,
  "testResults": [
    { "testCaseNumber": 1, "input": string, "expectedOutput": string, "actualOutput": string, "passed": boolean, "notes": string }
  ],
  "optimizationSuggestions": string[]
}

Problem:
${context || "Two Sum"}

Code:
${code}`;

    const aiResponse = await executeAIPrompt(prompt);
    const parsed = extractJsonFromResponse<CodingEvaluationResult>(aiResponse);
    if (parsed && typeof parsed.correctnessScore === "number" && parsed.complexityTime) {
      return parsed;
    }
  } catch (error) {
    console.warn("AI coding evaluation failed, using smart fallback:", error);
  }

  return evaluateSmartCodingSubmission(code, language, context);
}

export async function generateFinalInterviewReport(
  scores: { round: number; score: number; type: string }[]
): Promise<InterviewFinalEvaluation> {
  return generateSmartInterviewReport(scores);
}

export interface RoadmapSynthesisContext {
  role?: string;
  missingSkills?: string[];
  interviewWeaknesses?: string[];
  resumeGaps?: string[];
  resumeText?: string;
  targetCompany?: string;
}

export async function generateLearningRoadmap(
  roleOrContext: string | RoadmapSynthesisContext = "Full-Stack Software Engineer",
  fallbackWeaknesses: string[] = []
): Promise<LearningRoadmapData> {
  const context: RoadmapSynthesisContext =
    typeof roleOrContext === "object" && roleOrContext !== null
      ? roleOrContext
      : { role: roleOrContext, missingSkills: fallbackWeaknesses };

  const targetRole = context.role || "Full-Stack Software Engineer";
  const missingSkills = context.missingSkills?.length
    ? context.missingSkills.join(", ")
    : "PostgreSQL Indexing, System Design, CI/CD, React 19 Architecture";
  const interviewGaps = context.interviewWeaknesses?.length
    ? context.interviewWeaknesses.join("; ")
    : "Recommended structure, quantifying technical impact, async event loop";
  const resumeGaps = context.resumeGaps?.length
    ? context.resumeGaps.join("; ")
    : "Cloud deployments, performance optimization metrics";

  try {
    const prompt = `You are a Principal Software Engineering Mentor and Tech Career Strategist.
Generate a comprehensive, custom 4-Week Technical Learning Roadmap tailored specifically to close this candidate's verified skill gaps.

Target Role: ${targetRole}
Key Missing Skills (from Target Job Descriptions): ${missingSkills}
Interview Diagnostic Weaknesses (from Mock Interviews): ${interviewGaps}
Resume Improvement Areas: ${resumeGaps}

Generate a 4-week structured milestone curriculum:
- Week 1: Foundational core language / architecture gap
- Week 2: Deep dive into the missing framework / frontend / backend tech
- Week 3: Database scaling, query optimization, or cloud infrastructure
- Week 4: Interview mastery (System design, live coding, and communication)

Return strictly valid JSON only matching this schema:
{
  "title": "4-Week Master Roadmap for ${targetRole}",
  "targetRole": "${targetRole}",
  "overallProgress": 0,
  "totalWeeks": 4,
  "items": [
    {
      "weekNumber": 1,
      "skill": string,
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "currentLevel": "Beginner" | "Intermediate",
      "targetLevel": "Intermediate" | "Advanced" | "Proficient",
      "resources": [
        { "title": "freeCodeCamp - [Skill] Full Course (YouTube)", "url": "https://www.youtube.com/c/Freecodecamp", "type": "Video" },
        { "title": "Full Stack Open / Harvard CS50 (Free Course)", "url": "https://fullstackopen.com/en/", "type": "Course" },
        { "title": "Official Documentation & API Reference", "url": "https://docs.docker.com", "type": "Documentation" },
        { "title": "Roadmap.sh / LeetCode (Interactive Practice)", "url": "https://roadmap.sh", "type": "Practice" }
      ],
      "isCompleted": false
    }
  ]
}

Include rich free YouTube video courses and free tutorials for every single week in the resources array.`;

    const aiResponse = await executeAIPrompt(prompt);
    const parsed = extractJsonFromResponse<LearningRoadmapData>(aiResponse);
    if (parsed && Array.isArray(parsed.items) && parsed.items.length >= 4) {
      // Ensure resources have valid YouTube URLs if type is Video
      for (const item of parsed.items) {
        if (!item.resources || !Array.isArray(item.resources) || item.resources.length === 0) {
          item.resources = [
            { title: `${item.skill} - Free Full Course (YouTube)`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill + " full course tutorial freecodecamp")}`, type: "Video" },
            { title: `${item.skill} Official Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(item.skill + " official documentation")}`, type: "Documentation" },
          ];
        } else {
          for (const res of item.resources) {
            if (res.type === "Video" && (!res.url || res.url === "#")) {
              res.url = `https://www.youtube.com/results?search_query=${encodeURIComponent(res.title || item.skill + " tutorial")}`;
            }
          }
        }
      }
      return parsed;
    }
  } catch (error) {
    console.warn("AI learning roadmap generation failed, using smart fallback:", error);
  }

  return generateSmartLearningRoadmap(targetRole, context.missingSkills || fallbackWeaknesses);
}
