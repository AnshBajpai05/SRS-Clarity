import { create } from 'zustand';

export type AnalysisMode = 'FULL' | 'PARTIAL' | 'UNPROCESSED' | 'NONE';
export type SourceType = 'pdf' | 'markdown' | null;

export interface SRSSection {
  title: string;
  content: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AmbiguityIssue {
  id: string;
  text: string;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  suggestedRewrite: string;
  category: 'vague' | 'missing-actor' | 'undefined-term';
}

export interface Defect {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'conflict' | 'version-mismatch' | 'dependency' | 'logic';
  description: string;
  rootCause: string;
  requirements: string[];
}

export interface Enhancement {
  id: string;
  original: string;
  improved: string;
  impactScore: number;
  changes: string[];
}

export interface TraceItem {
  requirement: string;
  feature: string;
  module: string;
  testCase: string;
}

export interface TestCase {
  id: string;
  title: string;
  requirement: string;
  type: 'functional' | 'edge' | 'negative';
  input: string;
  expectedOutput: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ClarityMetrics {
  clarityScore: number;
  ambiguityPercent: number;
  completenessPercent: number;
  consistencyPercent: number;
  defectDensity: number;
}

interface DocumentState {
  fileName: string | null;
  sourceType: SourceType;
  analysisMode: AnalysisMode;
  rawContent: string | null;
  sections: SRSSection[];
  ambiguities: AmbiguityIssue[];
  defects: Defect[];
  enhancements: Enhancement[];
  traceability: TraceItem[];
  testCases: TestCase[];
  metrics: ClarityMetrics | null;
  structureConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  missingSections: string[];
  loadDocument: (fileName: string, content: string, sourceType: SourceType) => void;
  clearDocument: () => void;
  reparse: () => void;
}

const MOCK_SECTIONS: SRSSection[] = [
  { title: 'Functional Requirements', content: '## FR-001: User Authentication\nThe system shall provide secure authentication using OAuth 2.0.\n\n## FR-002: Data Export\nThe system should allow users to export data in multiple formats.\n\n## FR-003: Dashboard\nThe system shall display real-time analytics on the main dashboard.', confidence: 'HIGH' },
  { title: 'Non-functional Requirements', content: '## NFR-001: Performance\nThe system should be fast and responsive.\n\n## NFR-002: Scalability\nThe system must handle a large number of users.\n\n## NFR-003: Security\nAll data must be encrypted at rest and in transit.', confidence: 'MEDIUM' },
  { title: 'Constraints', content: '## C-001: Technology Stack\nThe system must use React and Node.js.\n\n## C-002: Browser Support\nSupport for Chrome, Firefox, Safari, Edge.', confidence: 'HIGH' },
  { title: 'Assumptions', content: '## A-001: Internet Connectivity\nUsers will have stable internet.\n\n## A-002: Modern Browsers\nUsers will use browsers released within the last 2 years.', confidence: 'HIGH' },
];

const MOCK_AMBIGUITIES: AmbiguityIssue[] = [
  { id: 'AMB-001', text: 'The system should be fast and responsive', severity: 'high', explanation: '"Fast" and "responsive" are subjective terms without measurable criteria.', suggestedRewrite: 'The system shall respond to user requests within 200ms for 95th percentile of requests.', category: 'vague' },
  { id: 'AMB-002', text: 'The system must handle a large number of users', severity: 'high', explanation: '"Large number" is undefined. No specific capacity mentioned.', suggestedRewrite: 'The system shall support 10,000 concurrent users with less than 5% degradation in response time.', category: 'vague' },
  { id: 'AMB-003', text: 'Users will have stable internet', severity: 'medium', explanation: '"Stable internet" is not defined. No fallback for offline scenarios.', suggestedRewrite: 'The system assumes a minimum bandwidth of 1 Mbps. Offline mode shall queue operations for sync.', category: 'undefined-term' },
  { id: 'AMB-004', text: 'The system should allow users to export data', severity: 'low', explanation: 'No actor specified — which user role can export?', suggestedRewrite: 'Authenticated users with "Analyst" role shall be able to export data in CSV, JSON, and PDF formats.', category: 'missing-actor' },
];

const MOCK_DEFECTS: Defect[] = [
  { id: 'DEF-001', title: 'Authentication Conflict', severity: 'critical', type: 'conflict', description: 'FR-001 specifies OAuth 2.0, but NFR-003 implies custom encryption that may conflict with OAuth token handling.', rootCause: 'Ambiguous security scope between authentication and encryption requirements.', requirements: ['FR-001', 'NFR-003'] },
  { id: 'DEF-002', title: 'Performance vs Scalability Gap', severity: 'high', type: 'logic', description: 'NFR-001 demands "fast" response without defining metrics, while NFR-002 requires handling "large" user loads. These are potentially conflicting without resource allocation.', rootCause: 'Missing quantitative thresholds for both performance and scalability.', requirements: ['NFR-001', 'NFR-002'] },
  { id: 'DEF-003', title: 'Missing Dependency Chain', severity: 'medium', type: 'dependency', description: 'FR-003 (Dashboard) depends on data from FR-002 (Export), but no data pipeline is defined.', rootCause: 'No integration requirement between dashboard and data export modules.', requirements: ['FR-002', 'FR-003'] },
];

const MOCK_ENHANCEMENTS: Enhancement[] = [
  { id: 'ENH-001', original: 'The system should be fast and responsive.', improved: 'The system shall respond to all API requests within 200ms at the 95th percentile under normal load (up to 5,000 concurrent users).', impactScore: 92, changes: ['Added measurable response time', 'Defined load conditions', 'Specified percentile'] },
  { id: 'ENH-002', original: 'The system must handle a large number of users.', improved: 'The system shall support 10,000 concurrent users with horizontal auto-scaling, maintaining response times under 500ms at the 99th percentile.', impactScore: 88, changes: ['Defined user capacity', 'Added scaling strategy', 'Set performance threshold'] },
  { id: 'ENH-003', original: 'The system should allow users to export data in multiple formats.', improved: 'Authenticated users with "Analyst" or "Admin" roles shall export datasets up to 100MB in CSV, JSON, and PDF formats, with progress indication for exports exceeding 10MB.', impactScore: 76, changes: ['Specified user roles', 'Added size limits', 'Included UX consideration'] },
];

const MOCK_TRACEABILITY: TraceItem[] = [
  { requirement: 'FR-001', feature: 'User Login', module: 'Auth Module', testCase: 'TC-001' },
  { requirement: 'FR-002', feature: 'Data Export', module: 'Export Module', testCase: 'TC-002' },
  { requirement: 'FR-003', feature: 'Analytics Dashboard', module: 'Dashboard Module', testCase: 'TC-003' },
  { requirement: 'NFR-001', feature: 'API Response Time', module: 'API Gateway', testCase: 'TC-004' },
  { requirement: 'NFR-002', feature: 'Auto-scaling', module: 'Infrastructure', testCase: 'TC-005' },
  { requirement: 'NFR-003', feature: 'Encryption', module: 'Security Module', testCase: 'TC-006' },
];

const MOCK_TESTS: TestCase[] = [
  { id: 'TC-001', title: 'Valid OAuth Login', requirement: 'FR-001', type: 'functional', input: 'Valid Google OAuth credentials', expectedOutput: 'User authenticated, JWT token issued, redirect to dashboard', priority: 'high' },
  { id: 'TC-002', title: 'CSV Export - Large Dataset', requirement: 'FR-002', type: 'edge', input: 'Dataset with 1M rows, CSV format selected', expectedOutput: 'File generated within 30s, download initiated, progress bar shown', priority: 'high' },
  { id: 'TC-003', title: 'Dashboard Load Under Stress', requirement: 'FR-003', type: 'functional', input: '5,000 concurrent users accessing dashboard', expectedOutput: 'Dashboard renders within 2s, all widgets load, no errors', priority: 'medium' },
  { id: 'TC-004', title: 'Invalid Token Access', requirement: 'FR-001', type: 'negative', input: 'Expired JWT token in Authorization header', expectedOutput: '401 Unauthorized response, redirect to login', priority: 'high' },
  { id: 'TC-005', title: 'Export with No Data', requirement: 'FR-002', type: 'edge', input: 'Empty dataset, PDF format selected', expectedOutput: 'Friendly message: "No data to export", no file generated', priority: 'low' },
  { id: 'TC-006', title: 'SQL Injection in Search', requirement: 'NFR-003', type: 'negative', input: "Search query: ' OR 1=1 --", expectedOutput: 'Input sanitized, no data leak, request logged', priority: 'high' },
];

const MOCK_METRICS: ClarityMetrics = {
  clarityScore: 68,
  ambiguityPercent: 32,
  completenessPercent: 75,
  consistencyPercent: 71,
  defectDensity: 0.25,
};

export const useDocumentStore = create<DocumentState>((set) => ({
  fileName: null,
  sourceType: null,
  analysisMode: 'NONE',
  rawContent: null,
  sections: [],
  ambiguities: [],
  defects: [],
  enhancements: [],
  traceability: [],
  testCases: [],
  metrics: null,
  structureConfidence: null,
  missingSections: [],

  loadDocument: (fileName, content, sourceType) => {
    const hasFunctional = content.toLowerCase().includes('functional');
    const hasNonfunctional = content.toLowerCase().includes('non-functional');
    const hasConstraints = content.toLowerCase().includes('constraint');
    const hasAssumptions = content.toLowerCase().includes('assumption');

    const missing: string[] = [];
    if (!hasFunctional) missing.push('Functional Requirements');
    if (!hasNonfunctional) missing.push('Non-functional Requirements');
    if (!hasConstraints) missing.push('Constraints');
    if (!hasAssumptions) missing.push('Assumptions');

    const mode: AnalysisMode = missing.length === 0 ? 'FULL' : missing.length < 3 ? 'PARTIAL' : 'UNPROCESSED';

    set({
      fileName,
      sourceType,
      analysisMode: mode,
      rawContent: content,
      sections: MOCK_SECTIONS,
      ambiguities: MOCK_AMBIGUITIES,
      defects: MOCK_DEFECTS,
      enhancements: MOCK_ENHANCEMENTS,
      traceability: MOCK_TRACEABILITY,
      testCases: MOCK_TESTS,
      metrics: MOCK_METRICS,
      structureConfidence: mode === 'FULL' ? 'HIGH' : mode === 'PARTIAL' ? 'MEDIUM' : 'LOW',
      missingSections: missing,
    });
  },

  clearDocument: () => set({
    fileName: null, sourceType: null, analysisMode: 'NONE', rawContent: null,
    sections: [], ambiguities: [], defects: [], enhancements: [],
    traceability: [], testCases: [], metrics: null, structureConfidence: null, missingSections: [],
  }),

  reparse: () => {
    set((state) => {
      if (!state.rawContent || !state.fileName) return state;
      return { ...state, analysisMode: 'FULL', structureConfidence: 'HIGH', missingSections: [] };
    });
  },
}));
