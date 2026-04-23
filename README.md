# CandidateIQ — Candidate Review Dashboard

A production-grade internal hiring dashboard for reviewing 100+ candidates across assignment, video, ATS, GitHub, and communication scores.

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Build for production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Zustand** for global state management
- **Radix UI** for accessible components (Slider, Select, Dialog, Tabs)
- **Lucide React** for icons

---

## Features Implemented

### 1. Candidate List Panel
- Table layout with Name, College, Assignment Score, Video Score, ATS Score, Priority, Status
- **Search** by name or college (live filter)
- **Status filter** via quick-select chips (All / Pending / Reviewed / Shortlisted)
- **Score range filters** for Assignment, Video, ATS (expandable panel)
- **Sort** by any score column — click header to toggle asc/desc

### 2. Candidate Detail Panel
- Floating side panel (right side, rounded, with margin — never touches screen edge)
- Shows all 5 scores with live progress bars
- Priority label + formula displayed live
- Status update dropdown (Pending / Reviewed / Shortlisted)
- Closes on backdrop click or Escape key

### 3. Assignment Evaluation Panel
Sliders (1–5) for 6 criteria:
- UI Quality, Component Structure, State Handling, Edge Cases, Responsiveness, Accessibility
- **Ratings persist across panel opens** (stored in global state)
- Assignment score updates live as sliders move → priority recalculates instantly

### 4. Video Evaluation Panel
Sliders (1–5) for 5 criteria:
- Clarity, Confidence, Architecture, Tradeoff Reasoning, Communication
- **Timestamp notes** — add/remove notes at specific timestamps (e.g. "2:10 – unclear reasoning")
- Notes persist per candidate in global state

### 5. Priority Engine (Live)
```
Priority = 0.30 × Assignment + 0.25 × Video + 0.20 × ATS + 0.15 × GitHub + 0.10 × Communication
```
| Score | Label | Meaning |
|-------|-------|---------|
| ≥ 80  | P0 🟢 | Interview immediately |
| ≥ 65  | P1 🟡 | Strong shortlist |
| ≥ 50  | P2 🟠 | Review later |
| < 50  | P3 🔴 | Reject |

Priority updates in real time as assignment/video sliders are adjusted.

### 6. Dashboard Summary Bar
- Total candidates
- Reviewed count (candidates marked Reviewed or Shortlisted)
- Shortlisted count (explicitly shortlisted)
- Pending count

### 7. Comparison Mode
- Click **Compare Mode** button → checkboxes appear on each row
- Select 2–3 candidates → side-by-side metric bars appear below the table
- Best score per metric highlighted with ★
- Exit compare mode resets selection

### 8. Visual Priority Indicators
- 🟢 P0 — Green
- 🟡 P1 — Amber/Yellow
- 🟠 P2 — Orange
- 🔴 P3 — Red

---

## Dummy Data

100 candidates generated locally in `src/utils/dataGenerator.js` with realistic Indian names and top colleges. Each candidate has all 5 scores randomized within realistic ranges.

## Project Structure

```
src/
├── components/
│   ├── AssignmentPanel.jsx   # 6-criteria slider evaluation
│   ├── CandidateDrawer.jsx   # Side panel with all scores + tabs
│   ├── CandidateRow.jsx      # Single table row
│   ├── CandidateTable.jsx    # Full table with sort/pagination
│   ├── ComparisonView.jsx    # Side-by-side comparison
│   ├── Filters.jsx           # Search + status chips + score ranges
│   ├── SummaryBar.jsx        # 4 stat cards
│   └── VideoPanel.jsx        # 5-criteria sliders + timestamp notes
├── pages/
│   ├── Home.jsx              # Landing page
│   └── Dashboard.jsx         # Main dashboard shell
├── store/
│   └── useCandidateStore.js  # Zustand store — all state + actions
└── utils/
    ├── dataGenerator.js      # 100 dummy candidates
    └── priority.js           # Score + label calculation
```
