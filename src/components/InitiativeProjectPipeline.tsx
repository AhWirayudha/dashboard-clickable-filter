'use client';

import React from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Settings, 
  Users, 
  Building, 
  Zap, 
  Cog,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

// Define pipeline stages with visual styling
const PIPELINE_STAGES = [
  { 
    key: 'FEL 1',
    label: 'FEL 2', 
    width: 'w-32',
    height: 'h-40',
    color: 'bg-teal-400',
    icon: Calendar,
    projects: []
  },
  { 
    key: 'FEL 2',
    label: 'FEL 3', 
    width: 'w-28',
    height: 'h-36',
    color: 'bg-teal-500',
    icon: Settings,
    projects: []
  },
  { 
    key: 'FEL 3',
    label: 'Detail Engineering', 
    width: 'w-24',
    height: 'h-32',
    color: 'bg-teal-600',
    icon: Users,
    projects: []
  },
  { 
    key: 'Execute',
    label: 'Construction', 
    width: 'w-20',
    height: 'h-28',
    color: 'bg-teal-700',
    icon: Building,
    projects: []
  },
  { 
    key: 'Operate',
    label: 'Commissioning', 
    width: 'w-16',
    height: 'h-24',
    color: 'bg-teal-800',
    icon: Zap,
    projects: []
  },
  { 
    key: 'Optimize',
    label: 'Operate Optimize', 
    width: 'w-16',
    height: 'h-24',
    color: 'bg-teal-900',
    icon: Cog,
    projects: []
  },
  { 
    key: 'Complete',
    label: 'Ore Processing', 
    width: 'w-20',
    height: 'h-20',
    color: 'bg-slate-400',
    icon: CheckCircle,
    projects: []
  }
];

// Project categories with colors
type ProjectCategory = 'Gold' | 'Copper' | 'Silver' | 'Platinum' | 'Iron';

const PROJECT_CATEGORIES: Record<ProjectCategory, { color: string; textColor: string }> = {
  'Gold': { color: 'bg-yellow-500', textColor: 'text-yellow-900' },
  'Copper': { color: 'bg-orange-500', textColor: 'text-orange-900' },
  'Silver': { color: 'bg-gray-400', textColor: 'text-gray-900' },
  'Platinum': { color: 'bg-purple-500', textColor: 'text-purple-900' },
  'Iron': { color: 'bg-red-600', textColor: 'text-red-100' }
};

// Sample project data for demonstration
interface PipelineProject {
  id: string;
  name: string;
  category: ProjectCategory;
  stage: string;
  priority: number;
}

// Generate deterministic sample projects to avoid hydration mismatch
const generateSampleProjects = (): PipelineProject[] => {
  const stages = [
    { stage: 'FEL 1', count: 3 },
    { stage: 'FEL 2', count: 4 },
    { stage: 'FEL 3', count: 2 },
    { stage: 'Execute', count: 2 },
    { stage: 'Operate', count: 2 },
    { stage: 'Optimize', count: 1 },
    { stage: 'Complete', count: 4 },
  ];

  const categories: ProjectCategory[] = ['Gold', 'Copper', 'Silver', 'Platinum', 'Iron'];
  const projects: PipelineProject[] = [];
  let projectIndex = 0;

  for (const stageInfo of stages) {
    for (let i = 0; i < stageInfo.count; i++) {
      const id = `SMPL-${projectIndex + 1}`;
      const category = categories[projectIndex % categories.length];
      
      // Generate deterministic priority based on project index
      const priority = (projectIndex % 5) + 1;
      
      projects.push({
        id,
        name: `PT ${String.fromCodePoint(65 + (projectIndex % 26))}`,
        category,
        stage: stageInfo.stage,
        priority
      });
      
      projectIndex++;
    }
  }
  
  return projects;
};

const SAMPLE_PROJECTS: PipelineProject[] = generateSampleProjects();

interface ProjectBubbleProps {
  project: typeof SAMPLE_PROJECTS[0];
  size: 'sm' | 'md' | 'lg';
}

const ProjectBubble: React.FC<ProjectBubbleProps> = ({ project, size }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const categoryStyle = PROJECT_CATEGORIES[project.category as keyof typeof PROJECT_CATEGORIES] || PROJECT_CATEGORIES.Gold;

  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white',
        sizeClasses[size],
        categoryStyle.color,
        categoryStyle.textColor
      )}
      title={`${project.name} - ${project.category} - Priority ${project.priority}`}
    >
      {project.priority}
    </div>
  );
};

interface PipelineStageProps {
  stage: typeof PIPELINE_STAGES[0];
  projects: typeof SAMPLE_PROJECTS;
}

const PipelineStage: React.FC<PipelineStageProps> = ({ stage, projects }) => {
  const stageProjects = projects.filter(p => p.stage === stage.key);

  return (
    <div className="flex flex-col items-center">
      {/* Funnel Shape Container */}
      <div className={cn(
        'relative flex flex-col items-center justify-center rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200',
        stage.width,
        stage.height,
        stage.color
      )}>
        {/* Project Bubbles */}
        <div className="absolute inset-2 flex flex-wrap items-center justify-center gap-1 p-2">
          {stageProjects.slice(0, 8).map((project) => {
            const getBubbleSize = (projectCount: number): 'sm' | 'md' | 'lg' => {
              if (projectCount > 4) return 'sm';
              if (projectCount > 2) return 'md';
              return 'lg';
            };
            
            return (
              <ProjectBubble 
                key={project.id} 
                project={project} 
                size={getBubbleSize(stageProjects.length)} 
              />
            );
          })}
          {stageProjects.length > 8 && (
            <div className="w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
              +{stageProjects.length - 8}
            </div>
          )}
        </div>
      </div>

      {/* Stage Label */}
      <div className="mt-3 text-center">
        <h4 className="text-sm font-medium text-gray-800">{stage.label}</h4>
        <p className="text-xs text-gray-600">{stageProjects.length} projects</p>
      </div>
    </div>
  );
};

export function InitiativeProjectPipeline() {
  const { filteredProjects } = useFilter();

  // Map filtered projects to our sample format for demonstration
  const mappedProjects: PipelineProject[] = filteredProjects.map((project, index) => {
    // Use deterministic priority based on project ID hash to avoid hydration mismatch
    const getPriorityFromId = (id: string): number => {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        const char = id.codePointAt(i) || 0;
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash % 5) + 1;
    };

    return {
      id: project.id,
      name: project.name.split(' ')[0] + ' ' + String.fromCodePoint(65 + (index % 26)), // Generate PT A, PT B, etc.
      category: ['Gold', 'Copper', 'Silver', 'Platinum', 'Iron'][index % 5] as ProjectCategory,
      stage: project.felStage,
      priority: getPriorityFromId(project.id)
    };
  });

  // Combine sample projects with mapped projects for demo
  const allProjects = [...SAMPLE_PROJECTS, ...mappedProjects];

  // Group projects by execution phase for bottom section
  const initiationProjects = allProjects.filter(p => ['FEL 1'].includes(p.stage));
  const planningProjects = allProjects.filter(p => ['FEL 2', 'FEL 3'].includes(p.stage));
  const executionProjects = allProjects.filter(p => ['Execute', 'Operate', 'Optimize', 'Complete'].includes(p.stage));

  const groupedByCategory = (projects: PipelineProject[]) => {
    const groups: Record<string, PipelineProject[]> = {};
    for (const project of projects) {
      if (!groups[project.category]) {
        groups[project.category] = [];
      }
      groups[project.category].push(project);
    }
    return groups;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-teal-600" />
          <h3 className="text-xl font-bold text-gray-900">Initiative Project Pipelines</h3>
        </div>
        <div className="text-sm text-gray-600">
          Total Projects: <span className="font-medium text-gray-900">{allProjects.length}</span>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="mb-12">
        <div className="flex items-end justify-center gap-4 mb-8 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => (
            <PipelineStage 
              key={stage.key} 
              stage={stage} 
              projects={allProjects} 
            />
          ))}
        </div>
      </div>

      {/* Project Phase Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Initiation Phase */}
        <div className="bg-blue-900 rounded-lg p-4 text-white">
          <h4 className="text-lg font-bold mb-4 text-center">Initiation</h4>
          <div className="space-y-3">
            {Object.entries(groupedByCategory(initiationProjects)).map(([category, projects]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-4 h-4 rounded-full',
                    PROJECT_CATEGORIES[category as keyof typeof PROJECT_CATEGORIES]?.color || 'bg-gray-400'
                  )}></div>
                  <span className="text-sm font-medium">{category}</span>
                </div>
                <div className="flex gap-1">
                  {projects.slice(0, 3).map(project => (
                    <div key={project.id} className="flex items-center gap-1">
                      <span className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                        PROJECT_CATEGORIES[project.category]?.color || 'bg-gray-400',
                        PROJECT_CATEGORIES[project.category]?.textColor || 'text-gray-900'
                      )}>
                        {project.priority}
                      </span>
                      <span className="text-xs">{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planning Phase */}
        <div className="bg-blue-900 rounded-lg p-4 text-white">
          <h4 className="text-lg font-bold mb-4 text-center">Planning</h4>
          <div className="space-y-3">
            {Object.entries(groupedByCategory(planningProjects)).map(([category, projects]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-4 h-4 rounded-full',
                    PROJECT_CATEGORIES[category as keyof typeof PROJECT_CATEGORIES]?.color || 'bg-gray-400'
                  )}></div>
                  <span className="text-sm font-medium">{category}</span>
                </div>
                <div className="flex gap-1">
                  {projects.slice(0, 2).map(project => (
                    <div key={project.id} className="flex items-center gap-1">
                      <span className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                        PROJECT_CATEGORIES[project.category]?.color || 'bg-gray-400',
                        PROJECT_CATEGORIES[project.category]?.textColor || 'text-gray-900'
                      )}>
                        {project.priority}
                      </span>
                      <span className="text-xs">{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Phase */}
        <div className="bg-blue-900 rounded-lg p-4 text-white">
          <h4 className="text-lg font-bold mb-4 text-center">Execution</h4>
          <div className="space-y-3">
            {Object.entries(groupedByCategory(executionProjects)).map(([category, projects]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-4 h-4 rounded-full',
                    PROJECT_CATEGORIES[category as keyof typeof PROJECT_CATEGORIES]?.color || 'bg-gray-400'
                  )}></div>
                  <span className="text-sm font-medium">{category}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {projects.slice(0, 5).map(project => (
                    <div key={project.id} className="flex items-center gap-1 mb-1">
                      <span className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                        PROJECT_CATEGORIES[project.category]?.color || 'bg-gray-400',
                        PROJECT_CATEGORIES[project.category]?.textColor || 'text-gray-900'
                      )}>
                        {project.priority}
                      </span>
                      <span className="text-xs">{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h5 className="text-sm font-medium text-gray-800 mb-3">Project Categories</h5>
        <div className="flex flex-wrap gap-4">
          {Object.entries(PROJECT_CATEGORIES).map(([category, style]) => (
            <div key={category} className="flex items-center gap-2">
              <div className={cn('w-4 h-4 rounded-full', style.color)}></div>
              <span className="text-sm text-gray-700">{category}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Numbers in circles represent project priority levels (1-5)
        </p>
      </div>
    </div>
  );
}