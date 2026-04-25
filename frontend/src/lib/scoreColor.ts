export const getScoreColor = (n: number) =>
  n >= 85 ? '#10B981' : n >= 70 ? '#F59E0B' : 
  n >= 50 ? '#EF4444' : '#9CA3AF';

export const getScoreBadge = (n: number) =>
  n >= 85 ? 'bg-emerald-100 text-emerald-700' :
  n >= 70 ? 'bg-amber-100 text-amber-700' :
  n >= 50 ? 'bg-red-100 text-red-600' :
  'bg-gray-100 text-gray-500';