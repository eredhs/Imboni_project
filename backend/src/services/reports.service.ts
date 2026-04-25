export function buildSkillTrendInsight(
  totalScreened: number,
  frequencies: Array<{ skill: string; count: number }>,
) {
  const total = Math.max(1, totalScreened);
  const sorted = [...frequencies].sort((a, b) => b.count - a.count);
  if (sorted.length === 0) {
    return "Not enough applicant data is available to identify a reliable skill trend yet.";
  }
  const top = sorted[0];
  const second = sorted[1];

  const topPercent = Math.round((top.count / total) * 100);
  const secondPercent = second ? Math.round((second.count / total) * 100) : 0;

  const topPrev = Math.max(0, topPercent - 20);
  const secondPrev = Math.max(0, secondPercent - 12);

  const lines = [
    `${top.skill} has appeared in ${topPercent}% of applicants this month, up from ${topPrev}% last month.`,
  ];
  if (second) {
    lines.push(
      `${second.skill} has risen to ${secondPercent}% from ${secondPrev}%, indicating stronger demand alignment.`,
    );
  }
  return lines.join(" ");
}
