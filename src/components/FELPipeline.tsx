'use client';

import React from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { cn, formatCurrency, getFELStageColor } from '@/lib/utils';
import { ArrowRight, DollarSign, Users } from 'lucide-react';

const FEL_STAGES = ['FEL 1', 'FEL 2', 'FEL 3', 'Execute', 'Operate'] as const;
const STAGE_DESCRIPTIONS = {
  'FEL 1': 'Business Objectives & Concept Selection',
  'FEL 2': 'Basic Engineering & Project Definition',
  'FEL 3': 'Detailed Engineering & Execution Planning',
  'Execute': 'Construction & Commissioning',
  'Operate': 'Operations & Maintenance'
};

function getPriorityClass(priority: string): string {
  if (priority === 'Critical') return 'bg-red-100 text-red-800';
  if (priority === 'High') return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-800';
}

export function FELPipeline() {
  const { filteredProjects } = useFilter();

  const stageData = FEL_STAGES.map(stage => {
    const stageProjects = filteredProjects.filter(p => p.felStage === stage);
    const totalBudget = stageProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = stageProjects.reduce((sum, p) => sum + p.actualSpend, 0);
    const avgProgress = stageProjects.length > 0 
      ? stageProjects.reduce((sum, p) => sum + p.completionPercentage, 0) / stageProjects.length 
      : 0;

    return {
      stage,
      description: STAGE_DESCRIPTIONS[stage],
      projects: stageProjects,
      projectCount: stageProjects.length,
      totalBudget,
      totalSpent,
      avgProgress,
      criticalCount: stageProjects.filter(p => p.priority === 'Critical').length,
      highRiskCount: stageProjects.filter(p => p.risks === 'High').length
    };
  });

  const totalProjects = filteredProjects.length;
  const maxProjectsInStage = Math.max(...stageData.map(s => s.projectCount));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">FEL Pipeline Analysis</h3>
          <p className="text-sm text-gray-600">Front End Loading stages and project distribution</p>
        </div>
        <div className="text-sm text-gray-600">
          Total Projects: <span className="font-medium text-gray-900">{totalProjects}</span>
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {stageData.map((stage, index) => (
            <React.Fragment key={stage.stage}>
              {/* Stage Column */}
              <div className="flex-1 max-w-48">
                <div className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  stage.projectCount > 0 
                    ? "border-blue-200 bg-blue-50" 
                    : "border-gray-200 bg-gray-50"
                )}>
                  {/* Stage Header */}
                  <div className="text-center mb-3">
                    <div className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2",
                      getFELStageColor(stage.stage)
                    )}>
                      {stage.stage}
                    </div>
                    <h4 className="text-xs text-gray-600 font-medium">
                      {stage.description}
                    </h4>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Users className="w-3 h-3" />
                        Projects
                      </span>
                      <span className="font-medium text-gray-900">{stage.projectCount}</span>
                    </div>
                    
                    {stage.totalBudget > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-gray-600">
                          <DollarSign className="w-3 h-3" />
                          Budget
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(stage.totalBudget)}
                        </span>
                      </div>
                    )}

                    {stage.avgProgress > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{stage.avgProgress.toFixed(1)}%</span>
                      </div>
                    )}

                    {stage.criticalCount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-red-600">Critical</span>
                        <span className="font-medium text-red-700">{stage.criticalCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {maxProjectsInStage > 0 && (
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ 
                            width: `${(stage.projectCount / maxProjectsInStage) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {((stage.projectCount / totalProjects) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow */}
              {index < stageData.length - 1 && (
                <div className="flex items-center justify-center px-2">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Project Details by Stage */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Projects by Stage</h4>
        {stageData.filter(stage => stage.projectCount > 0).map(stage => (
          <div key={stage.stage} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className={cn(
                "font-medium px-2 py-1 rounded text-sm",
                getFELStageColor(stage.stage)
              )}>
                {stage.stage} - {stage.projectCount} Projects
              </h5>
              <div className="text-sm text-gray-600">
                Total Budget: {formatCurrency(stage.totalBudget)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stage.projects.map(project => (
                <div key={project.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h6 className="text-sm font-medium text-gray-900 truncate">
                        {project.name}
                      </h6>
                      <p className="text-xs text-gray-600 mt-1">{project.projectManager}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full font-medium",
                          getPriorityClass(project.priority)
                        )}>
                          {project.priority}
                        </span>
                        {project.risks === 'High' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">
                            High Risk
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-medium text-gray-900">{project.completionPercentage}%</div>
                      <div className="text-gray-600">{formatCurrency(project.budget)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-3">Pipeline Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Early Stage (FEL 1-2):</span>
            <span className="ml-2 font-medium text-gray-900">
              {stageData.slice(0, 2).reduce((sum, s) => sum + s.projectCount, 0)} projects
            </span>
          </div>
          <div>
            <span className="text-gray-600">Execution Ready:</span>
            <span className="ml-2 font-medium text-gray-900">
              {stageData.slice(2, 4).reduce((sum, s) => sum + s.projectCount, 0)} projects
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Budget:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatCurrency(stageData.reduce((sum, s) => sum + s.totalBudget, 0))}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Critical Projects:</span>
            <span className="ml-2 font-medium text-red-600">
              {stageData.reduce((sum, s) => sum + s.criticalCount, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
