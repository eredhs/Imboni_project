export function getScoreColor(score: number) {
  if (score >= 85) {
    return "#10B981";
  }

  if (score >= 70) {
    return "#F59E0B";
  }

  if (score >= 50) {
    return "#EF4444";
  }

  return "#9CA3AF";
}

export function getScoreBg(score: number): string {
  if (score >= 85) return "bg-emerald-100 text-emerald-700";
  if (score >= 70) return "bg-amber-100 text-amber-700";
  if (score >= 50) return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-500";
}

export function getScoreLabel(score: number) {
  if (score >= 85) {
    return "Excellent Match";
  }

  if (score >= 70) {
    return "Good Match";
  }

  if (score >= 50) {
    return "Partial Match";
  }

  return "Low Match";
}
