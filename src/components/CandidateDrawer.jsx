import { useCandidateStore } from '../store/useCandidateStore'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { getPriorityLabel, getPriorityColor } from '../utils/priority'
import { cn } from '../lib/utils'
import AssignmentPanel from './AssignmentPanel'
import VideoPanel from './VideoPanel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { GraduationCap, Calendar, Github, MessageSquare, FileText, Video, BarChart2, X, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'

function ScoreCard({ label, value, icon: Icon, color }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className="bg-slate-50 rounded-xl p-3.5 flex items-center gap-3 border border-slate-100 hover:border-slate-200 transition-colors">
      <div className={cn('rounded-lg p-2 flex-shrink-0', color.bg)}>
        <Icon className={cn('w-4 h-4', color.text)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 font-medium">{label}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className={cn('h-full rounded-full transition-all duration-300', color.bar)} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-bold text-slate-800 tabular-nums w-8 text-right">{value}</span>
        </div>
      </div>
    </div>
  )
}

const STATUS_STYLES = {
  Shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Reviewed: 'bg-sky-50 text-sky-700 border-sky-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
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

export default function CandidateDrawer() {
  const selectedCandidate = useCandidateStore((s) => s.selectedCandidate)
  const clearSelectedCandidate = useCandidateStore((s) => s.clearSelectedCandidate)
  const updateStatus = useCandidateStore((s) => s.updateStatus)
  // Subscribe to live candidates so scores update in real time as sliders move
  const candidates = useCandidateStore((s) => s.candidates)

  // Always get the freshest data from the store
  const candidate = selectedCandidate
    ? candidates.find((c) => c.id === selectedCandidate.id) || selectedCandidate
    : null

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') clearSelectedCandidate() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [clearSelectedCandidate])

  if (!candidate) return null

  const label = getPriorityLabel(candidate.priority_score)
  const colors = getPriorityColor(label)
  const gradient = getGradient(candidate.name)

  return (
    <>
      
      <div
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
        onClick={clearSelectedCandidate}
      />

      
      <div
        className="fixed right-4 top-4 bottom-4 z-50 w-full max-w-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
       
        <button
          onClick={clearSelectedCandidate}
          className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-red-100 flex items-center justify-center text-slate-500 hover:text-red-600 transition-colors"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          
          <div className="flex items-start gap-4 pr-10">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0`}>
              {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{candidate.name}</h2>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{candidate.college}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Calendar className="w-3 h-3" />
                Applied {candidate.appliedDate}
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border',
                  colors.bg, colors.text, colors.border
                )}>
                  <span className={cn('w-2 h-2 rounded-full', colors.dot)} />
                  {label} · {candidate.priority_score}
                </span>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', STATUS_STYLES[candidate.status] || STATUS_STYLES.Pending)}>
                  {candidate.status}
                </span>
              </div>
            </div>
          </div>

          
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">Set Status</span>
            <Select value={candidate.status} onValueChange={(v) => updateStatus(candidate.id, v)}>
              <SelectTrigger className="flex-1 h-8 text-sm rounded-lg border-slate-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">⏳ Pending</SelectItem>
                <SelectItem value="Reviewed">✅ Reviewed</SelectItem>
                <SelectItem value="Shortlisted">⭐ Shortlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>

        
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Performance Scores</h3>
              <span className="text-[10px] text-slate-300 ml-auto">Updates as you evaluate below</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <ScoreCard label="Assignment" value={candidate.assignment_score} icon={FileText}
                color={{ bg: 'bg-indigo-100', text: 'text-indigo-600', bar: 'bg-indigo-500' }} />
              <ScoreCard label="Video" value={candidate.video_score} icon={Video}
                color={{ bg: 'bg-violet-100', text: 'text-violet-600', bar: 'bg-violet-500' }} />
              <ScoreCard label="ATS Score" value={candidate.ats_score} icon={BarChart2}
                color={{ bg: 'bg-sky-100', text: 'text-sky-600', bar: 'bg-sky-500' }} />
              <ScoreCard label="GitHub" value={candidate.github_score} icon={Github}
                color={{ bg: 'bg-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500' }} />
              <ScoreCard label="Communication" value={candidate.communication_score} icon={MessageSquare}
                color={{ bg: 'bg-amber-100', text: 'text-amber-600', bar: 'bg-amber-500' }} />

              
              <div className={cn(
                'rounded-xl p-3.5 border flex flex-col justify-between',
                colors.bg.replace('bg-', 'bg-').replace('50', '50'),
                colors.border
              )}>
                <div className={cn('text-xs font-semibold', colors.text)}>Priority Score</div>
                <div className={cn('text-3xl font-bold tabular-nums', colors.text)}>{candidate.priority_score}</div>
                <div className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full self-start mt-1', colors.bg, colors.text, colors.border, 'border')}>
                  {label}
                </div>
              </div>
            </div>
          </div>
          
       
          
          <Tabs defaultValue="assignment">
            <TabsList className="w-full bg-slate-100 rounded-xl p-1">
              <TabsTrigger value="assignment" className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                📄 Assignment
              </TabsTrigger>
              <TabsTrigger value="video" className="flex-1 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                🎥 Video
              </TabsTrigger>
            </TabsList>
            <TabsContent value="assignment" className="mt-4">
              <AssignmentPanel candidate={candidate} />
            </TabsContent>
            <TabsContent value="video" className="mt-4">
              <VideoPanel candidate={candidate} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
