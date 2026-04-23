import { useCandidateStore } from '../store/useCandidateStore'
import { Slider } from './ui/slider'
import { cn } from '../lib/utils'

const CRITERIA = [
  { key: 'ui_quality', label: 'UI Quality', desc: 'Visual polish and design sense', emoji: '🎨' },
  { key: 'component_structure', label: 'Component Structure', desc: 'Organization and reusability', emoji: '🧩' },
  { key: 'state_handling', label: 'State Handling', desc: 'Data flow and state management', emoji: '⚙️' },
  { key: 'edge_cases', label: 'Edge Cases', desc: 'Error handling and robustness', emoji: '🛡️' },
  { key: 'responsiveness', label: 'Responsiveness', desc: 'Mobile and cross-device support', emoji: '📱' },
  { key: 'accessibility', label: 'Accessibility', desc: 'A11y and semantic HTML', emoji: '♿' },
]

const RATING_LABELS = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent']

const ratingColor = (v) => {
  if (v >= 5) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
  if (v >= 4) return 'text-sky-600 bg-sky-50 border-sky-200'
  if (v >= 3) return 'text-amber-600 bg-amber-50 border-amber-200'
  if (v >= 2) return 'text-orange-600 bg-orange-50 border-orange-200'
  return 'text-rose-600 bg-rose-50 border-rose-200'
}

export default function AssignmentPanel({ candidate }) {
  const setAssignmentRating = useCandidateStore((s) => s.setAssignmentRating)
  // Always read live ratings from the store-synced candidate
  const liveCandidates = useCandidateStore((s) => s.candidates)
  const live = liveCandidates.find((c) => c.id === candidate.id) || candidate
  const ratings = live.assignmentRatings || {}
  const score = live.assignment_score

  return (
    <div className="space-y-5">
      {/* Score header */}
      <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
        <div>
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Assignment Score</div>
          <div className="text-xs text-indigo-400 mt-0.5">Updates live as you rate</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-indigo-700 tabular-nums">{score}</div>
          <div className="text-xs text-indigo-400">/100</div>
        </div>
      </div>

      {/* Criteria */}
      {CRITERIA.map((c) => {
        const val = ratings[c.key] ?? 3
        return (
          <div key={c.key} className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{c.emoji}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{c.label}</div>
                  <div className="text-xs text-slate-400">{c.desc}</div>
                </div>
              </div>
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border tabular-nums min-w-[90px] text-center', ratingColor(val))}>
                {val}/5 · {RATING_LABELS[val]}
              </span>
            </div>
            <Slider
              min={1} max={5} step={1}
              value={[val]}
              onValueChange={([v]) => setAssignmentRating(candidate.id, c.key, v)}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-300 px-0.5">
              <span>1 · Poor</span>
              <span>3 · Average</span>
              <span>5 · Excellent</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
