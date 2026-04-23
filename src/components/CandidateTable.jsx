import { useState } from 'react'
import { useCandidateStore } from '../store/useCandidateStore'
import CandidateRow from './CandidateRow'
import { ChevronUp, ChevronDown, ChevronsUpDown, GitCompare } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

const COLS = [
  { label: 'Candidate', key: null },
  { label: 'Assignment', key: 'assignment_score' },
  { label: 'Video', key: 'video_score' },
  { label: 'ATS', key: 'ats_score' },
  { label: 'Priority', key: 'priority_score' },
  { label: 'Status', key: null },
  { label: '', key: null },
]

const PAGE_SIZE = 20

export default function CandidateTable() {
  // Subscribe to all relevant state so table re-renders when filters/sort change
  const candidates = useCandidateStore((s) => s.candidates)
  const filters = useCandidateStore((s) => s.filters)
  const sortBy = useCandidateStore((s) => s.sortBy)
  const sortDir = useCandidateStore((s) => s.sortDir)
  const setSort = useCandidateStore((s) => s.setSort)
  const compareMode = useCandidateStore((s) => s.compareMode)
  const toggleCompareMode = useCandidateStore((s) => s.toggleCompareMode)
  const compareList = useCandidateStore((s) => s.compareList)
  const getFiltered = useCandidateStore((s) => s.getFiltered)

  const [page, setPage] = useState(1)

  // Re-compute whenever relevant state changes (candidates, filters, sortBy, sortDir all subscribed above)
  const filtered = getFiltered()
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage = Math.min(page, Math.max(1, totalPages))
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filtered.length}</span> candidate{filtered.length !== 1 ? 's' : ''}
        </div>
        <Button
          variant={compareMode ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'gap-2 h-8 text-xs font-medium rounded-lg',
            compareMode && 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
          )}
          onClick={() => { toggleCompareMode(); setPage(1) }}
        >
          <GitCompare className="w-3.5 h-3.5" />
          {compareMode ? `Comparing ${compareList.length}/3 — Exit` : 'Compare Mode'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              {compareMode && <th className="w-10 pl-4" />}
              {COLS.map((col) => (
                <th
                  key={col.label}
                  className={cn(
                    'py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider',
                    col.key && 'cursor-pointer hover:text-slate-700 select-none transition-colors'
                  )}
                  onClick={() => { if (col.key) { setSort(col.key); setPage(1) } }}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key && (
                      sortBy === col.key
                        ? sortDir === 'desc'
                          ? <ChevronDown className="w-3 h-3 text-indigo-500" />
                          : <ChevronUp className="w-3 h-3 text-indigo-500" />
                        : <ChevronsUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={compareMode ? 8 : 7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">🔍</div>
                    <p className="text-sm font-medium text-slate-500">No candidates match your filters</p>
                    <p className="text-xs text-slate-400">Try adjusting the search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((c) => <CandidateRow key={c.id} candidate={c} />)
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/40">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-lg"
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </Button>
          <span className="text-xs text-slate-400 font-medium">
            Page {safePage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-lg"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  )
}
