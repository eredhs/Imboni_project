type ScoreRingTone = "neutral" | "primary" | "danger";

type ScoreRingProps = {
  score: number;
  size?: number;
  tone?: ScoreRingTone;
  label?: string;
  lineWidth?: number;
};

const toneMap: Record<ScoreRingTone, string> = {
  neutral: "#1f2937",
  primary: "#5b5ce9",
  danger: "#ef4f4f",
};

export function ScoreRing({
  score,
  size = 52,
  tone = "neutral",
  label,
  lineWidth = 4,
}: ScoreRingProps) {
  const safeScore = Math.max(0, Math.min(100, score));
  const radius = size / 2 - lineWidth - 1;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - safeScore / 100);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`${safeScore}% ${label ?? "score"}`}
    >
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#eceef3"
          strokeWidth={lineWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={toneMap[tone]}
          strokeWidth={lineWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 220ms ease",
          }}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center leading-none">
        <span
          className={`${size >= 80 ? "text-[18px]" : "text-[16px]"} font-bold text-slate-900`}
        >
          {safeScore}
          {size >= 80 ? "%" : ""}
        </span>
        {label ? (
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
