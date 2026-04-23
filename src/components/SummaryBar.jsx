import { useMemo } from 'react'
import { useCandidateStore } from '../store/useCandidateStore'
import { Users, CheckCircle, Star, Clock } from 'lucide-react'

export default function SummaryBar() {
  const candidates = useCandidateStore((s) => s.candidates)

  const stats = useMemo(() => {
    const total = candidates.length
    // "Reviewed" = any candidate whose status has been changed from Pending
    const reviewed = candidates.filter((c) => c.reviewed).length
    // "Shortlisted" = candidates explicitly marked Shortlisted
    const shortlisted = candidates.filter((c) => c.shortlisted).length
    const pending = candidates.filter((c) => !c.reviewed).length
    return { total, reviewed, shortlisted, pending }
  }, [candidates])

  const cards = [
    {
      label: 'Total Candidates',
      value: stats.total,
      icon: Users,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      valueColor: 'text-indigo-700',
    },
    {
      label: 'Reviewed',
      value: stats.reviewed,
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Shortlisted',
      value: stats.shortlisted,
      icon: Star,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      valueColor: 'text-amber-700',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-100',
      valueColor: 'text-rose-700',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`rounded-xl p-2.5 flex-shrink-0 ${c.iconBg}`}>
            <c.icon className={`w-5 h-5 ${c.iconColor}`} />
          </div>
          <div>
            <div className={`text-2xl font-bold ${c.valueColor} tabular-nums`}>{c.value}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5 leading-tight">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
