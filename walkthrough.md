# SRS Clarity — Phase 1 Walkthrough

## What Was Built

Phase 1 transformed SRS Clarity from a **10-page mock-data prototype** into a **focused, 3-surface product powered by real pipeline output**.

---

## Backend Changes

### Stage 5 Fix: "As the" Pattern
render_diffs(file:///f:/AMRITA%20ALL%20SEMESTER/projects/SRS%20Clarity/backend/pipeline/stage5_intelligence_vlm.py)

**Impact:** US011 and US012 ("As the Admin") now parse correctly → 10 stories mapped instead of 8.

---

### Stage 6: Ambiguity Detection Engine (NEW)

**File:** [stage6_ambiguity_vlm.py](file:///f:/AMRITA%20ALL%20SEMESTER/projects/SRS%20Clarity/backend/pipeline/stage6_ambiguity_vlm.py)

- Dictionary of **30 vague terms** with severity + suggested measurable alternatives
- **Weak verb detection** ("should", "may", "could")
- **Missing reason flagging** (stories without "so that")
- Deduplication and severity grouping
- Output: `stage6_issues/*.json` with structured `AmbiguityIssue` objects

**Test Result:** 8 ambiguities detected across 10 stories (4 high, 4 low)

---

### FastAPI Bridge (NEW)

**File:** [api.py](file:///f:/AMRITA%20ALL%20SEMESTER/projects/SRS%20Clarity/backend/api.py)

| Endpoint | Purpose |
|:---|:---|
| `POST /api/upload` | Accept PDF, run pipeline Stages 2-6 |
| `GET /api/documents` | List all processed documents with stats |
| `GET /api/document/{id}/intelligence` | Stage 5 structured model |
| `GET /api/document/{id}/issues` | Stage 6 ambiguities |
| `GET /api/document/{id}/markdown` | Cleaned markdown |

---

## Frontend Surgery

### Deleted (9 files)
`EnhancerPage`, `TraceabilityPage`, `TestsPage`, `ClarityPage`, `ExportPage`, `ChatPage`, `DefectsPage`, `ParserPage`, `AmbiguityPage`

### Rewritten
- [documentStore.ts](file:///f:/AMRITA%20ALL%20SEMESTER/projects/SRS%20Clarity/src/store/documentStore.ts) — All mock data removed, replaced with `fetch` calls to FastAPI
- [App.tsx](file:///f:/AMRITA%20ALL%20SEMESTER/projects/SRS%20Clarity/src/App.tsx) — 3 routes: `/`, `/viewer`, `/issues`
- [AppSidebar.tsx](file:///f:/AMRITA%20ALL%20SEMESTER/projects/SRS%20Clarity/src/components/AppSidebar.tsx) — 3 nav items
- [AppHeader.tsx](file:///f:/AMRITA%20ALL%20SEMESTER/projects/SRS%20Clarity/src/components/AppHeader.tsx) — Real upload + live doc status

### New Surfaces

#### 1. Dashboard — Entry Point
Auto-fetches processed documents, shows list with story count + issue count.

![Dashboard showing processed document list with real stats](C:/Users/anshb/.gemini/antigravity/brain/a81ef972-c426-48ef-b71a-93223424386a/dashboard_screenshot.png)

#### 2. Document Viewer — Source of Truth
Story-first design: each story is a collapsible card with Role/Goal/Reason + AC tree.

![Document Viewer showing 10 real user stories with Role/Goal/Reason and Acceptance Criteria](C:/Users/anshb/.gemini/antigravity/brain/a81ef972-c426-48ef-b71a-93223424386a/viewer_screenshot.png)

#### 3. Issues Page — THE Product
Real ambiguities grouped by severity. Each card shows flagged text, explanation, and suggested fix.

![Issues page showing 8 real ambiguities detected, grouped by severity with actionable fixes](C:/Users/anshb/.gemini/antigravity/brain/a81ef972-c426-48ef-b71a-93223424386a/issues_screenshot.png)

---

## End-to-End Flow

![Full product flow recording](C:/Users/anshb/.gemini/antigravity/brain/a81ef972-c426-48ef-b71a-93223424386a/issues_flow_1776283628185.webp)

---

## Verification

| Check | Result |
|:---|:---|
| TypeScript build | ✅ Zero errors (`npx tsc --noEmit` exit 0) |
| Pipeline Stage 6 | ✅ 8 ambiguities across 10 stories |
| API `/api/documents` | ✅ Returns real data |
| Dashboard | ✅ Auto-fetches + shows doc list |
| Document Viewer | ✅ 10 stories with Role/Goal/Reason + AC |
| Issues Page | ✅ 4 high + 4 low severity grouped correctly |

---

## What's Next (Phase 2)

- **Conflict detection** — Cross-reference logic blocks across stories for contradictions
- Add "Conflicts" tab to Issues page
