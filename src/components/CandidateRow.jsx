import { useCandidateStore } from '../store/useCandidateStore'
import { getPriorityLabel, getPriorityColor } from '../utils/priority'
import { cn } from '../lib/utils'
import { CheckSquare, Square } from 'lucide-react'

function ScoreBar({ value }) {
  const color =
    value >= 75 ? 'bg-emerald-500' :
    value >= 50 ? 'bg-amber-400' :
    value >= 30 ? 'bg-orange-400' : 'bg-rose-400'
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-14 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-600 tabular-nums w-7">{value}</span>
    </div>
  )
}

const STATUS_STYLES = {
  Shortlisted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Reviewed: 'bg-sky-50 text-sky-700 border border-sky-200',
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const AVATAR_GRADIENTS = [
  'from-indigo-400 to-violet-500',
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
]

function getGradient(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]
}

export default function CandidateRow({ candidate }) {
  const setSelectedCandidate = useCandidateStore((s) => s.setSelectedCandidate)
  const compareMode = useCandidateStore((s) => s.compareMode)
  const compareList = useCandidateStore((s) => s.compareList)
  const toggleCompare = useCandidateStore((s) => s.toggleCompare)

  const label = getPriorityLabel(candidate.priority_score)
  const colors = getPriorityColor(label)
  const isInCompare = compareList.includes(candidate.id)
  const gradient = getGradient(candidate.name)

  return (
    <tr
      className={cn(
        'border-b border-slate-50 transition-colors cursor-pointer group',
        isInCompare ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50'
      )}
      onClick={() => !compareMode && setSelectedCandidate(candidate)}
    >
      {compareMode && (
        <td
          className="pl-4 py-3.5 w-10"
          onClick={(e) => { e.stopPropagation(); toggleCompare(candidate.id) }}
        >
          {isInCompare
            ? <CheckSquare className="w-4 h-4 text-indigo-600" />
            : <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />}
        </td>
      )}
      <td className="py-3.5 pl-4 pr-2">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
            {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800 leading-tight">{candidate.name}</div>
            <div className="text-xs text-slate-400 truncate max-w-[160px]">{candidate.college}</div>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4"><ScoreBar value={candidate.assignment_score} /></td>
      <td className="py-3.5 px-4"><ScoreBar value={candidate.video_score} /></td>
      <td className="py-3.5 px-4"><ScoreBar value={candidate.ats_score} /></td>
      <td className="py-3.5 px-4">
        <span className={cn(
          'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border',
          colors.bg, colors.text, colors.border
        )}>
          <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
          {label} · {candidate.priority_score}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_STYLES[candidate.status] || STATUS_STYLES.Pending)}>
          {candidate.status}
        </span>
      </td>
      <td className="py-3.5 pr-5">
        <span className="text-xs text-slate-300 group-hover:text-indigo-400 font-medium transition-colors">
          View →
        </span>
      </td>
    </tr>
  )
}
