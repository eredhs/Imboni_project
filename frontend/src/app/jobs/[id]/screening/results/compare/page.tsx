import { ComparisonShell } from "@/components/comparison/comparison-shell";

export default async function ComparisonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ids?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const ids =
    (query.ids ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3);
  return <ComparisonShell jobId={id} ids={ids} />;
}
