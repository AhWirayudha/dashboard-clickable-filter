// Complex Project Management Dashboard Sample Data
export interface Project {
  id: string;
  name: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  felStage: 'FEL 1' | 'FEL 2' | 'FEL 3' | 'Execute' | 'Operate';
  budget: number;
  actualSpend: number;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  department: string;
  businessUnit: string;
  company: string;
  projectManager: string;
  risks: 'Low' | 'Medium' | 'High';
  category: 'Infrastructure' | 'Digital' | 'Manufacturing' | 'R&D' | 'Operations';
}

export interface SCurveData {
  projectId: string;
  date: string;
  plannedProgress: number;
  actualProgress: number;
  plannedCost: number;
  actualCost: number;
}

export interface GanttTask {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface KPIMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onTimeProjects: number;
  budgetVariance: number;
  avgProjectDuration: number;
  resourceUtilization: number;
  riskProjects: number;
}

// Sample Projects Data
export const projects: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Digital Transformation Initiative',
    status: 'Active',
    felStage: 'FEL 2',
    budget: 2500000,
    actualSpend: 1200000,
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    completionPercentage: 48,
    priority: 'Critical',
    department: 'IT',
    businessUnit: 'Technology',
    company: 'TechCorp',
    projectManager: 'Sarah Chen',
    risks: 'Medium',
    category: 'Digital'
  },
  {
    id: 'PRJ-002',
    name: 'Manufacturing Plant Expansion',
    status: 'Active',
    felStage: 'FEL 3',
    budget: 15000000,
    actualSpend: 8500000,
    startDate: '2023-06-01',
    endDate: '2025-03-15',
    completionPercentage: 65,
    priority: 'High',
    department: 'Operations',
    businessUnit: 'Manufacturing',
    company: 'IndustrialCorp',
    projectManager: 'Michael Rodriguez',
    risks: 'High',
    category: 'Manufacturing'
  },
  {
    id: 'PRJ-003',
    name: 'R&D Innovation Lab Setup',
    status: 'Planning',
    felStage: 'FEL 1',
    budget: 3200000,
    actualSpend: 150000,
    startDate: '2024-03-01',
    endDate: '2024-11-30',
    completionPercentage: 15,
    priority: 'Medium',
    department: 'R&D',
    businessUnit: 'Innovation',
    company: 'TechCorp',
    projectManager: 'Dr. Lisa Park',
    risks: 'Low',
    category: 'R&D'
  },
  {
    id: 'PRJ-004',
    name: 'Infrastructure Modernization',
    status: 'Active',
    felStage: 'Execute',
    budget: 8900000,
    actualSpend: 7200000,
    startDate: '2023-09-15',
    endDate: '2024-08-30',
    completionPercentage: 85,
    priority: 'High',
    department: 'Engineering',
    businessUnit: 'Infrastructure',
    company: 'EngineeringCorp',
    projectManager: 'James Wilson',
    risks: 'Medium',
    category: 'Infrastructure'
  },
  {
    id: 'PRJ-005',
    name: 'Supply Chain Optimization',
    status: 'Completed',
    felStage: 'Operate',
    budget: 1800000,
    actualSpend: 1650000,
    startDate: '2023-01-01',
    endDate: '2023-10-15',
    completionPercentage: 100,
    priority: 'Medium',
    department: 'Supply Chain',
    businessUnit: 'Operations',
    company: 'LogisticsCorp',
    projectManager: 'Emma Thompson',
    risks: 'Low',
    category: 'Operations'
  },
  {
    id: 'PRJ-006',
    name: 'Cybersecurity Enhancement',
    status: 'Active',
    felStage: 'FEL 2',
    budget: 1200000,
    actualSpend: 450000,
    startDate: '2024-02-01',
    endDate: '2024-09-30',
    completionPercentage: 35,
    priority: 'Critical',
    department: 'IT',
    businessUnit: 'Technology',
    company: 'TechCorp',
    projectManager: 'Alex Kumar',
    risks: 'High',
    category: 'Digital'
  }
];

// S-Curve Data for Progress and Cost Analysis
export const sCurveData: SCurveData[] = [
  // PRJ-001 - Digital Transformation
  { projectId: 'PRJ-001', date: '2024-01-15', plannedProgress: 0, actualProgress: 0, plannedCost: 0, actualCost: 0 },
  { projectId: 'PRJ-001', date: '2024-02-15', plannedProgress: 8, actualProgress: 5, plannedCost: 200000, actualCost: 125000 },
  { projectId: 'PRJ-001', date: '2024-03-15', plannedProgress: 18, actualProgress: 15, plannedCost: 450000, actualCost: 375000 },
  { projectId: 'PRJ-001', date: '2024-04-15', plannedProgress: 30, actualProgress: 25, plannedCost: 750000, actualCost: 625000 },
  { projectId: 'PRJ-001', date: '2024-05-15', plannedProgress: 42, actualProgress: 38, plannedCost: 1050000, actualCost: 950000 },
  { projectId: 'PRJ-001', date: '2024-06-15', plannedProgress: 55, actualProgress: 48, plannedCost: 1375000, actualCost: 1200000 },
  
  // PRJ-002 - Manufacturing Plant Expansion
  { projectId: 'PRJ-002', date: '2023-06-01', plannedProgress: 0, actualProgress: 0, plannedCost: 0, actualCost: 0 },
  { projectId: 'PRJ-002', date: '2023-09-01', plannedProgress: 15, actualProgress: 12, plannedCost: 2250000, actualCost: 1800000 },
  { projectId: 'PRJ-002', date: '2023-12-01', plannedProgress: 35, actualProgress: 32, plannedCost: 5250000, actualCost: 4800000 },
  { projectId: 'PRJ-002', date: '2024-03-01', plannedProgress: 55, actualProgress: 52, plannedCost: 8250000, actualCost: 7800000 },
  { projectId: 'PRJ-002', date: '2024-06-01', plannedProgress: 70, actualProgress: 65, plannedCost: 10500000, actualCost: 8500000 },
  
  // PRJ-004 - Infrastructure Modernization
  { projectId: 'PRJ-004', date: '2023-09-15', plannedProgress: 0, actualProgress: 0, plannedCost: 0, actualCost: 0 },
  { projectId: 'PRJ-004', date: '2023-12-15', plannedProgress: 25, actualProgress: 22, plannedCost: 2225000, actualCost: 1958000 },
  { projectId: 'PRJ-004', date: '2024-03-15', plannedProgress: 55, actualProgress: 58, plannedCost: 4895000, actualCost: 5162000 },
  { projectId: 'PRJ-004', date: '2024-06-15', plannedProgress: 80, actualProgress: 85, plannedCost: 7120000, actualCost: 7200000 }
];

// Gantt Chart Tasks
export const ganttTasks: GanttTask[] = [
  // PRJ-001 Tasks
  { id: 'T-001', projectId: 'PRJ-001', name: 'Requirements Analysis', startDate: '2024-01-15', endDate: '2024-02-28', progress: 100, dependencies: [], assignee: 'John Smith', priority: 'High' },
  { id: 'T-002', projectId: 'PRJ-001', name: 'System Architecture Design', startDate: '2024-02-15', endDate: '2024-04-15', progress: 85, dependencies: ['T-001'], assignee: 'Sarah Chen', priority: 'Critical' },
  { id: 'T-003', projectId: 'PRJ-001', name: 'Development Phase 1', startDate: '2024-03-01', endDate: '2024-06-30', progress: 45, dependencies: ['T-002'], assignee: 'Dev Team A', priority: 'High' },
  { id: 'T-004', projectId: 'PRJ-001', name: 'Testing & QA', startDate: '2024-06-01', endDate: '2024-09-30', progress: 10, dependencies: ['T-003'], assignee: 'QA Team', priority: 'Medium' },
  
  // PRJ-002 Tasks
  { id: 'T-005', projectId: 'PRJ-002', name: 'Site Preparation', startDate: '2023-06-01', endDate: '2023-09-30', progress: 100, dependencies: [], assignee: 'Construction Team', priority: 'Critical' },
  { id: 'T-006', projectId: 'PRJ-002', name: 'Foundation Work', startDate: '2023-08-01', endDate: '2024-01-31', progress: 100, dependencies: ['T-005'], assignee: 'Civil Engineers', priority: 'High' },
  { id: 'T-007', projectId: 'PRJ-002', name: 'Equipment Installation', startDate: '2024-01-15', endDate: '2024-08-31', progress: 65, dependencies: ['T-006'], assignee: 'Technical Team', priority: 'High' },
  { id: 'T-008', projectId: 'PRJ-002', name: 'Commissioning', startDate: '2024-08-01', endDate: '2025-03-15', progress: 15, dependencies: ['T-007'], assignee: 'Operations Team', priority: 'Medium' }
];

// KPI Metrics
export const kpiMetrics: KPIMetrics = {
  totalProjects: 6,
  activeProjects: 4,
  completedProjects: 1,
  onTimeProjects: 3,
  budgetVariance: -5.2, // Negative means under budget
  avgProjectDuration: 14.5, // months
  resourceUtilization: 78.5, // percentage
  riskProjects: 2
};

// Resource Allocation Data
export const resourceAllocation = [
  { department: 'IT', allocated: 45, utilized: 38, capacity: 50 },
  { department: 'Engineering', allocated: 32, utilized: 30, capacity: 35 },
  { department: 'Operations', allocated: 28, utilized: 25, capacity: 30 },
  { department: 'R&D', allocated: 15, utilized: 12, capacity: 20 },
  { department: 'Supply Chain', allocated: 8, utilized: 8, capacity: 10 }
];

// Budget Analysis by Category
export const budgetByCategory = [
  { category: 'Digital', budget: 3700000, spent: 1650000, projects: 2 },
  { category: 'Manufacturing', budget: 15000000, spent: 8500000, projects: 1 },
  { category: 'Infrastructure', budget: 8900000, spent: 7200000, projects: 1 },
  { category: 'R&D', budget: 3200000, spent: 150000, projects: 1 },
  { category: 'Operations', budget: 1800000, spent: 1650000, projects: 1 }
];

// Timeline Milestones
export const milestones = [
  { id: 'M-001', projectId: 'PRJ-001', name: 'Phase 1 Complete', date: '2024-04-30', status: 'Completed' },
  { id: 'M-002', projectId: 'PRJ-001', name: 'System Go-Live', date: '2024-10-15', status: 'Upcoming' },
  { id: 'M-003', projectId: 'PRJ-002', name: 'Production Line 1 Ready', date: '2024-09-30', status: 'At Risk' },
  { id: 'M-004', projectId: 'PRJ-004', name: 'Infrastructure Cutover', date: '2024-07-15', status: 'Upcoming' },
  { id: 'M-005', projectId: 'PRJ-006', name: 'Security Audit Complete', date: '2024-08-31', status: 'Planned' }
];

// Risk Assessment Data
export const riskAssessment = [
  { projectId: 'PRJ-001', riskCategory: 'Technical', probability: 'Medium', impact: 'High', mitigation: 'Additional testing cycles' },
  { projectId: 'PRJ-002', riskCategory: 'Budget', probability: 'High', impact: 'Critical', mitigation: 'Cost optimization review' },
  { projectId: 'PRJ-002', riskCategory: 'Schedule', probability: 'Medium', impact: 'High', mitigation: 'Resource reallocation' },
  { projectId: 'PRJ-004', riskCategory: 'Resource', probability: 'Low', impact: 'Medium', mitigation: 'Cross-training program' },
  { projectId: 'PRJ-006', riskCategory: 'Security', probability: 'High', impact: 'Critical', mitigation: 'Enhanced monitoring' }
];
