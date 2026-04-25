import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import type { ParsedCandidateData } from "./gemini.service.js";

export type ExtractedResumeInput = {
  sourceName: string;
  rawText: string;
};

function extractEmail(rawText: string) {
  return rawText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
}

function extractPhone(rawText: string) {
  return rawText.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() ?? null;
}

function extractName(rawText: string) {
  const firstLine = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return null;
  }

  if (firstLine.includes("@") || /\d/.test(firstLine)) {
    return null;
  }

  const words = firstLine.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 5) {
    return null;
  }

  return firstLine;
}

function extractSkills(rawText: string) {
  const knownSkills = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "MongoDB",
    "Express",
    "Python",
    "Java",
    "C#",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Figma",
    "Tailwind CSS",
    "HTML",
    "CSS",
    "Git",
  ];

  const lowered = rawText.toLowerCase();
  return knownSkills.filter((skill) => lowered.includes(skill.toLowerCase()));
}

function extractCurrentRole(rawText: string) {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    lines.find((line) =>
      /(engineer|developer|designer|manager|analyst|specialist|consultant|lead|intern)/i.test(line),
    ) ?? null
  );
}

function estimateYearsOfExperience(rawText: string) {
  const explicitYears = rawText.match(/(\d+)\+?\s+years?/i);
  if (explicitYears) {
    return Number(explicitYears[1] ?? 0);
  }

  return 0;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

function parseCsvBuffer(buffer: Buffer, fileName: string): ExtractedResumeInput[] {
  const raw = buffer.toString("utf8").trim();
  if (!raw) {
    return [];
  }

  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) {
    return [{ sourceName: fileName, rawText: raw }];
  }

  const headers = lines[0]!.split(",").map((item) => item.trim());
  const records = lines.slice(1).map((line, index) => {
    const values = line.split(",").map((item) => item.trim());
    const pairs = headers.map((header, headerIndex) => `${header}: ${values[headerIndex] ?? ""}`);
    return {
      sourceName: `${fileName}#row-${index + 1}`,
      rawText: normalizeWhitespace(pairs.join("\n")),
    };
  });

  return records.filter((record) => record.rawText.trim().length > 0);
}

async function parsePdfBuffer(buffer: Buffer, fileName: string): Promise<ExtractedResumeInput[]> {
  const parsed = await pdfParse(buffer);
  const text = normalizeWhitespace(parsed.text || "");
  return text ? [{ sourceName: fileName, rawText: text }] : [];
}

async function parseDocxBuffer(buffer: Buffer, fileName: string): Promise<ExtractedResumeInput[]> {
  const parsed = await mammoth.extractRawText({ buffer });
  const text = normalizeWhitespace(parsed.value || "");
  return text ? [{ sourceName: fileName, rawText: text }] : [];
}

export async function extractResumeInputsFromFiles(
  files: Array<{ originalname: string; mimetype: string; buffer: Buffer }>,
): Promise<ExtractedResumeInput[]> {
  const extracted: ExtractedResumeInput[] = [];

  for (const file of files) {
    const fileName = file.originalname;
    const extension = fileName.toLowerCase().split(".").pop() ?? "";

    if (file.mimetype === "text/csv" || extension === "csv") {
      extracted.push(...parseCsvBuffer(file.buffer, fileName));
      continue;
    }

    if (file.mimetype === "application/pdf" || extension === "pdf") {
      extracted.push(...(await parsePdfBuffer(file.buffer, fileName)));
      continue;
    }

    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      extension === "docx"
    ) {
      extracted.push(...(await parseDocxBuffer(file.buffer, fileName)));
      continue;
    }

    const fallbackText = normalizeWhitespace(file.buffer.toString("utf8"));
    if (fallbackText) {
      extracted.push({ sourceName: fileName, rawText: fallbackText });
    }
  }

  return extracted;
}

export function buildFallbackParsedResume(rawText: string): ParsedCandidateData {
  return {
    fullName: extractName(rawText),
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    currentRole: extractCurrentRole(rawText),
    location: null,
    skills: extractSkills(rawText),
    yearsOfExperience: estimateYearsOfExperience(rawText),
    education: {
      highestDegree: "none",
      fieldOfStudy: "",
      institution: "",
      graduationYear: null,
    },
    certifications: [],
    projects: [],
    workHistory: [],
    languages: [],
    industries: [],
    dataQuality: "partial",
  };
}
