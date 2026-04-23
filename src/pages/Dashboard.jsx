import SummaryBar from '../components/SummaryBar'
import Filters from '../components/Filters'
import CandidateTable from '../components/CandidateTable'
import CandidateDrawer from '../components/CandidateDrawer'
import ComparisonView from '../components/ComparisonView'
import { useCandidateStore } from '../store/useCandidateStore'
import { Users, LayoutDashboard } from 'lucide-react'

export default function Dashboard({ onBack }) {
  const compareMode = useCandidateStore((s) => s.compareMode)

  return (
    <div className="min-h-screen bg-white">
      {/* Topbar */}
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
    <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
      
      <div className="flex items-center gap-3">
        
        {/* REMOVE back button */}

        {/* Brand (clickable) */}
        <div
          onClick={onBack}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
            <Users className="w-4 h-4 text-white" />
          </div>

          <span className="font-bold text-lg tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
            Conversely AI
          </span>
        </div>

      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <LayoutDashboard className="w-3.5 h-3.5" />
        Candidate Review Dashboard
      </div>

    </div>
  </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6">
        <SummaryBar />
        <Filters />
        <CandidateTable />
        {compareMode && <ComparisonView />}
        <CandidateDrawer />
      </main>
    </div>
  )
}
