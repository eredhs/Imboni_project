const CANONICAL_SKILLS: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React.js",
  reactjs: "React.js",
  "react.js": "React.js",
  nextjs: "Next.js",
  "next.js": "Next.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  kubernetes: "Kubernetes",
  k8s: "Kubernetes",
  aws: "Amazon Web Services",
  gcp: "Google Cloud Platform",
  azure: "Microsoft Azure",
  ml: "Machine Learning",
  ai: "Artificial Intelligence",
  "ci/cd": "CI/CD",
  docker: "Docker",
  git: "Git",
  graphql: "GraphQL",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
};

function levenshteinDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + substitutionCost,
      );
    }
  }

  return dp[a.length]![b.length]!;
}

export function normalizeSkill(raw: string): string {
  const lower = raw.toLowerCase().trim();
  if (CANONICAL_SKILLS[lower]) return CANONICAL_SKILLS[lower];

  let bestMatch = raw.trim();
  let bestDist = Infinity;
  for (const [key, canonical] of Object.entries(CANONICAL_SKILLS)) {
    const d = levenshteinDistance(lower, key);
    if (d < bestDist && d <= 2) {
      bestDist = d;
      bestMatch = canonical;
    }
  }
  return bestMatch;
}

export function normalizeSkills(skills: string[]): string[] {
  return Array.from(new Set(skills.map(normalizeSkill)));
}
