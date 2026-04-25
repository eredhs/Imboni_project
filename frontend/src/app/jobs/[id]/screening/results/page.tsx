import { ShortlistShell } from "@/components/shortlist/shortlist-shell";

export default async function ScreeningResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShortlistShell jobId={id} />;
}
