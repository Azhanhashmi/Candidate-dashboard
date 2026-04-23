export function calcPriority(candidate) {
  const score =
    0.30 * (candidate.assignment_score || 0) +
    0.25 * (candidate.video_score || 0) +
    0.20 * (candidate.ats_score || 0) +
    0.15 * (candidate.github_score || 0) +
    0.10 * (candidate.communication_score || 0)
  return Math.round(score * 10) / 10
}

export function getPriorityLabel(score) {
  if (score >= 80) return 'P0'
  if (score >= 65) return 'P1'
  if (score >= 50) return 'P2'
  return 'P3'
}

export function getPriorityColor(label) {
  switch (label) {
    case 'P0': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' }
    case 'P1': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' }
    case 'P2': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' }
    case 'P3': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' }
    default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' }
  }
}
