import { useCandidateStore } from '../store/useCandidateStore'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { Search, SlidersHorizontal, X, CheckCircle, Clock, Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Status', icon: null, color: 'bg-slate-100 text-slate-600 border-slate-200' },
  { value: 'Pending', label: 'Pending', icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'Reviewed', label: 'Reviewed', icon: CheckCircle, color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'Shortlisted', label: 'Shortlisted', icon: Star, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
]

function RangeFilter({ label, minKey, maxKey }) {
  const filters = useCandidateStore((s) => s.filters)
  const setFilter = useCandidateStore((s) => s.setFilter)
  return (
    <div className="flex flex-col gap-1.5 min-w-[150px]">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0} max={100}
          value={filters[minKey]}
          onChange={(e) => setFilter(minKey, Math.max(0, Math.min(100, Number(e.target.value))))}
          className="h-8 w-16 text-xs px-2 rounded-lg border-slate-200 text-center"
          placeholder="0"
        />
        <span className="text-slate-300 text-sm">—</span>
        <Input
          type="number"
          min={0} max={100}
          value={filters[maxKey]}
          onChange={(e) => setFilter(maxKey, Math.max(0, Math.min(100, Number(e.target.value))))}
          className="h-8 w-16 text-xs px-2 rounded-lg border-slate-200 text-center"
          placeholder="100"
        />
      </div>
    </div>
  )
}

export default function Filters() {
  const filters = useCandidateStore((s) => s.filters)
  const setFilter = useCandidateStore((s) => s.setFilter)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasActiveFilters =
    filters.search ||
    filters.status !== 'All' ||
    filters.assignmentMin > 0 || filters.assignmentMax < 100 ||
    filters.videoMin > 0 || filters.videoMax < 100 ||
    filters.atsMin > 0 || filters.atsMax < 100

  const resetFilters = () => {
    setFilter('search', '')
    setFilter('status', 'All')
    setFilter('assignmentMin', 0)
    setFilter('assignmentMax', 100)
    setFilter('videoMin', 0)
    setFilter('videoMax', 100)
    setFilter('atsMin', 0)
    setFilter('atsMax', 100)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4 space-y-4">
      {/* Primary row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or college…"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="pl-9 h-9 rounded-xl border-slate-200 bg-slate-50/80 placeholder:text-slate-400 focus:bg-white text-sm"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Advanced toggle */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-9 gap-2 rounded-xl border-slate-200 text-sm font-medium',
            showAdvanced && 'bg-indigo-50 border-indigo-200 text-indigo-700'
          )}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Score Filters
          {(filters.assignmentMin > 0 || filters.assignmentMax < 100 || filters.videoMin > 0 || filters.videoMax < 100 || filters.atsMin > 0 || filters.atsMax < 100) && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 text-slate-500 hover:text-rose-600 text-sm rounded-xl"
            onClick={resetFilters}
          >
            <X className="w-3.5 h-3.5" /> Reset
          </Button>
        )}
      </div>

      {/* Status quick-filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">Status:</span>
        {STATUS_OPTIONS.map((opt) => {
          const isActive = filters.status === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setFilter('status', opt.value)}
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all',
                isActive
                  ? opt.color + ' shadow-sm scale-105'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
              )}
            >
              {opt.icon && <opt.icon className="w-3 h-3" />}
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Advanced score range filters */}
      {showAdvanced && (
        <div className="flex flex-wrap gap-6 pt-3 border-t border-slate-100">
          <RangeFilter label="Assignment Score" minKey="assignmentMin" maxKey="assignmentMax" />
          <RangeFilter label="Video Score" minKey="videoMin" maxKey="videoMax" />
          <RangeFilter label="ATS Score" minKey="atsMin" maxKey="atsMax" />
        </div>
      )}
    </div>
  )
}
