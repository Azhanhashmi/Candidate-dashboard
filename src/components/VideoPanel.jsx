import { useState } from 'react'
import { useCandidateStore } from '../store/useCandidateStore'
import { Slider } from './ui/slider'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Plus, Trash2, Clock } from 'lucide-react'
import { cn } from '../lib/utils'

const CRITERIA = [
  { key: 'clarity', label: 'Clarity', desc: 'Clear explanation of thoughts', emoji: '💡' },
  { key: 'confidence', label: 'Confidence', desc: 'Delivery and presence', emoji: '🎤' },
  { key: 'architecture', label: 'Architecture', desc: 'System design knowledge', emoji: '🏗️' },
  { key: 'tradeoffs', label: 'Tradeoff Reasoning', desc: 'Decision-making rationale', emoji: '⚖️' },
  { key: 'communication', label: 'Communication', desc: 'Articulation and conciseness', emoji: '💬' },
]

const RATING_LABELS = ['', 'Poor', 'Below Avg', 'Average', 'Good', 'Excellent']

const ratingColor = (v) => {
  if (v >= 5) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
  if (v >= 4) return 'text-sky-600 bg-sky-50 border-sky-200'
  if (v >= 3) return 'text-amber-600 bg-amber-50 border-amber-200'
  if (v >= 2) return 'text-orange-600 bg-orange-50 border-orange-200'
  return 'text-rose-600 bg-rose-50 border-rose-200'
}

export default function VideoPanel({ candidate }) {
  const setVideoRating = useCandidateStore((s) => s.setVideoRating)
  const addVideoNote = useCandidateStore((s) => s.addVideoNote)
  const removeVideoNote = useCandidateStore((s) => s.removeVideoNote)
  // Always read live from store
  const liveCandidates = useCandidateStore((s) => s.candidates)
  const live = liveCandidates.find((c) => c.id === candidate.id) || candidate
  const ratings = live.videoRatings || {}
  const notes = live.videoNotes || []
  const score = live.video_score

  const [noteInput, setNoteInput] = useState('')
  const [tsInput, setTsInput] = useState('')

  const handleAddNote = () => {
    if (!noteInput.trim()) return
    addVideoNote(candidate.id, { ts: tsInput.trim() || '0:00', text: noteInput.trim() })
    setNoteInput('')
    setTsInput('')
  }

  return (
    <div className="space-y-5">
      {/* Score header */}
      <div className="flex items-center justify-between bg-violet-50 rounded-xl px-4 py-3 border border-violet-100">
        <div>
          <div className="text-xs font-semibold text-violet-400 uppercase tracking-wide">Video Score</div>
          <div className="text-xs text-violet-400 mt-0.5">Updates live as you rate</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-violet-700 tabular-nums">{score}</div>
          <div className="text-xs text-violet-400">/100</div>
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
              onValueChange={([v]) => setVideoRating(candidate.id, c.key, v)}
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

      {/* Timestamp Notes */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-semibold text-slate-700">Timestamp Notes</span>
          {notes.length > 0 && (
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
              {notes.length}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="2:10"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            className="w-20 h-8 text-xs font-mono text-center rounded-lg border-slate-200"
          />
          <Input
            placeholder="Add a note at this timestamp…"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            className="h-8 text-xs flex-1 rounded-lg border-slate-200"
          />
          <Button
            size="sm"
            className="h-8 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white"
            onClick={handleAddNote}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {notes.length === 0 ? (
          <p className="text-xs text-slate-300 text-center py-2">No notes yet — add timestamps above</p>
        ) : (
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {notes.map((n, i) => (
              <div key={i} className="flex items-start gap-2 text-xs bg-violet-50 rounded-lg px-3 py-2 border border-violet-100">
                <span className="font-mono font-bold text-violet-600 shrink-0 mt-0.5">{n.ts}</span>
                <span className="flex-1 text-slate-700 leading-relaxed">{n.text}</span>
                <button
                  onClick={() => removeVideoNote(candidate.id, i)}
                  className="text-slate-300 hover:text-rose-500 transition-colors mt-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
