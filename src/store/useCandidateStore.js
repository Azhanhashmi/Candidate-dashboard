import { create } from 'zustand'
import { generateCandidates } from '../utils/dataGenerator'
import { calcPriority } from '../utils/priority'

const rawCandidates = generateCandidates()

const ASSIGNMENT_CRITERIA = ['ui_quality', 'component_structure', 'state_handling', 'edge_cases', 'responsiveness', 'accessibility']
const VIDEO_CRITERIA = ['clarity', 'confidence', 'architecture', 'tradeoffs', 'communication']

function defaultRatings(keys) {
  return keys.reduce((acc, k) => ({ ...acc, [k]: 3 }), {})
}

function ratingsToScore(ratings) {
  const vals = Object.values(ratings)
  if (!vals.length) return 0
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20)
}

function withPriority(c) {
  return { ...c, priority_score: Math.round(calcPriority(c) * 10) / 10 }
}

function initCandidate(c) {
  const assignmentRatings = defaultRatings(ASSIGNMENT_CRITERIA)
  const videoRatings = defaultRatings(VIDEO_CRITERIA)
  return {
    ...withPriority(c),
    assignmentRatings,
    videoRatings,
    videoNotes: [],
  }
}

export const useCandidateStore = create((set, get) => ({
  candidates: rawCandidates.map(initCandidate),
  selectedCandidate: null,
  compareList: [],
  filters: {
    search: '',
    status: 'All',
    assignmentMin: 0,
    assignmentMax: 100,
    videoMin: 0,
    videoMax: 100,
    atsMin: 0,
    atsMax: 100,
  },
  sortBy: 'priority_score',
  sortDir: 'desc',
  compareMode: false,

  setSelectedCandidate: (candidate) => set({ selectedCandidate: candidate }),
  clearSelectedCandidate: () => set({ selectedCandidate: null }),

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  setSort: (key) =>
    set((state) => ({
      sortBy: key,
      sortDir: state.sortBy === key && state.sortDir === 'desc' ? 'asc' : 'desc',
    })),

  toggleCompareMode: () => set((state) => ({ compareMode: !state.compareMode, compareList: [] })),

  toggleCompare: (id) =>
    set((state) => {
      const already = state.compareList.includes(id)
      if (already) return { compareList: state.compareList.filter((x) => x !== id) }
      if (state.compareList.length >= 3) return state
      return { compareList: [...state.compareList, id] }
    }),

  // Update a single assignment rating criterion → recalculates assignment_score + priority live
  setAssignmentRating: (id, key, value) =>
    set((state) => {
      const candidates = state.candidates.map((c) => {
        if (c.id !== id) return c
        const assignmentRatings = { ...c.assignmentRatings, [key]: value }
        const assignment_score = ratingsToScore(assignmentRatings)
        return withPriority({ ...c, assignmentRatings, assignment_score })
      })
      const sel = state.selectedCandidate
      const selectedCandidate = sel?.id === id
        ? candidates.find((c) => c.id === id) || sel
        : sel
      return { candidates, selectedCandidate }
    }),

  // Update a single video rating criterion → recalculates video_score + priority live
  setVideoRating: (id, key, value) =>
    set((state) => {
      const candidates = state.candidates.map((c) => {
        if (c.id !== id) return c
        const videoRatings = { ...c.videoRatings, [key]: value }
        const video_score = ratingsToScore(videoRatings)
        return withPriority({ ...c, videoRatings, video_score })
      })
      const sel = state.selectedCandidate
      const selectedCandidate = sel?.id === id
        ? candidates.find((c) => c.id === id) || sel
        : sel
      return { candidates, selectedCandidate }
    }),

  // Add/remove video timestamp note
  addVideoNote: (id, note) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, videoNotes: [...(c.videoNotes || []), note] } : c
      ),
    })),

  removeVideoNote: (id, index) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, videoNotes: (c.videoNotes || []).filter((_, i) => i !== index) } : c
      ),
    })),

  updateStatus: (id, status) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id
          ? { ...c, status, reviewed: status !== 'Pending', shortlisted: status === 'Shortlisted' }
          : c
      ),
    })),

  // Always reads fresh state — filters, sort, search all work reactively
  getFiltered: () => {
    const { candidates, filters, sortBy, sortDir } = get()
    let list = candidates.filter((c) => {
      const q = (filters.search || '').toLowerCase().trim()
      if (q && !c.name.toLowerCase().includes(q) && !c.college.toLowerCase().includes(q)) return false
      if (filters.status && filters.status !== 'All' && c.status !== filters.status) return false
      if (c.assignment_score < filters.assignmentMin || c.assignment_score > filters.assignmentMax) return false
      if (c.video_score < filters.videoMin || c.video_score > filters.videoMax) return false
      if (c.ats_score < filters.atsMin || c.ats_score > filters.atsMax) return false
      return true
    })
    list = [...list].sort((a, b) => {
      const va = a[sortBy] ?? 0
      const vb = b[sortBy] ?? 0
      return sortDir === 'desc' ? vb - va : va - vb
    })
    return list
  },
}))
