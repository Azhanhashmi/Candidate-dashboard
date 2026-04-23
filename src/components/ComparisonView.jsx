import { useCandidateStore } from '../store/useCandidateStore'
import { getPriorityLabel, getPriorityColor } from '../utils/priority'
import { cn } from '../lib/utils'
import { X, GitCompare } from 'lucide-react'
import { Button } from './ui/button'

const METRICS = [
  { key: 'assignment_score', label: 'Assignment', emoji: '📄' },
  { key: 'video_score', label: 'Video', emoji: '🎥' },
  { key: 'ats_score', label: 'ATS Score', emoji: '📊' },
  { key: 'github_score', label: 'GitHub', emoji: '🐙' },
  { key: 'communication_score', label: 'Communication', emoji: '💬' },
  { key: 'priority_score', label: 'Priority Score', emoji: '⭐' },
]

const CANDIDATE_COLORS = [
  { bar: 'bg-indigo-500', light: 'bg-indigo-50', dot: 'bg-indigo-500', text: 'text-indigo-700', border: 'border-indigo-200' },
  { bar: 'bg-violet-500', light: 'bg-violet-50', dot: 'bg-violet-500', text: 'text-violet-700', border: 'border-violet-200' },
  { bar: 'bg-emerald-500', light: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200' },
]

function Bar({ value, max, colorClass, isBest, total }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClass, isBest && total > 1 && 'opacity-100')}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className={cn('text-xs font-bold tabular-nums w-8 text-right', isBest && total > 1 ? 'text-slate-900' : 'text-slate-500')}>
        {value}
        {isBest && total > 1 && <span className="text-[10px] ml-0.5">★</span>}
      </span>
    </div>
  )
}

const STATUS_STYLES = {
  Shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Reviewed: 'bg-sky-50 text-sky-700 border-sky-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
}

export default function ComparisonView() {
  const candidates = useCandidateStore((s) => s.candidates)
  const compareList = useCandidateStore((s) => s.compareList)
  const toggleCompare = useCandidateStore((s) => s.toggleCompare)
  const toggleCompareMode = useCandidateStore((s) => s.toggleCompareMode)

  const selected = compareList
    .map((id) => candidates.find((c) => c.id === id))
    .filter(Boolean)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-5 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 to-violet-50/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <GitCompare className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">Side-by-Side Comparison</h3>
            <p className="text-xs text-slate-400">{selected.length} candidate{selected.length !== 1 ? 's' : ''} selected — click rows to add more</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs rounded-xl border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200"
          onClick={toggleCompareMode}
        >
          Exit Compare
        </Button>
      </div>

      {selected.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-4xl mb-3">👆</div>
          <p className="text-sm font-medium text-slate-500">Select candidates from the table above to compare</p>
          <p className="text-xs text-slate-400 mt-1">You can compare up to 3 candidates side-by-side</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-36">Metric</th>
                {selected.map((c, i) => {
                  const lbl = getPriorityLabel(c.priority_score)
                  const pColors = getPriorityColor(lbl)
                  const cColor = CANDIDATE_COLORS[i]
                  return (
                    <th key={c.id} className="py-4 px-4 text-left">
                      <div className={cn('p-3 rounded-xl border', cColor.light, cColor.border)}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', {
                              'bg-indigo-500': i === 0,
                              'bg-violet-500': i === 1,
                              'bg-emerald-500': i === 2,
                            })}>
                              {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className={cn('font-bold text-sm', cColor.text)}>{c.name}</div>
                              <div className="text-xs text-slate-400 truncate max-w-[120px]">{c.college}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleCompare(c.id)}
                            className="text-slate-300 hover:text-slate-500 transition-colors mt-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border', pColors.bg, pColors.text, pColors.border)}>
                            {lbl} · {c.priority_score}
                          </span>
                          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', STATUS_STYLES[c.status] || STATUS_STYLES.Pending)}>
                            {c.status}
                          </span>
                        </div>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {METRICS.map((metric, mi) => (
                <tr key={metric.key} className={cn(mi % 2 === 0 ? 'bg-white' : 'bg-slate-50/40')}>
                  <td className="py-3.5 pl-6 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{metric.emoji}</span>
                      <span className="text-xs font-semibold text-slate-500">{metric.label}</span>
                    </div>
                  </td>
                  {selected.map((c, i) => {
                    const best = Math.max(...selected.map((x) => x[metric.key] || 0))
                    const isBest = c[metric.key] === best
                    return (
                      <td key={c.id} className="py-3.5 px-4">
                        <Bar
                          value={c[metric.key] || 0}
                          max={100}
                          colorClass={CANDIDATE_COLORS[i].bar}
                          isBest={isBest}
                          total={selected.length}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
