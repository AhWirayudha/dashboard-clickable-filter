'use client';

import React from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { projects } from '@/data/sampleData';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingDown, Users, DollarSign, Calendar, AlertCircle } from 'lucide-react';

const FUNNEL_STAGES = [
  { key: 'Planning', label: 'Planning & Concept', color: 'bg-purple-500', icon: Calendar },
  { key: 'Active', label: 'Active Development', color: 'bg-blue-500', icon: Users },
  { key: 'Completed', label: 'Completed Projects', color: 'bg-green-500', icon: TrendingDown },
  { key: 'On Hold', label: 'On Hold', color: 'bg-yellow-500', icon: AlertCircle },
] as const;

function getPriorityColorClass(priority: string): string {
  if (priority === 'Critical') return 'bg-red-100 text-red-800';
  if (priority === 'High') return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-800';
}

export function FunnelChart() {
  const { filteredProjects } = useFilter();

  const funnelData = FUNNEL_STAGES.map(stage => {
    const stageProjects = filteredProjects.filter(p => p.status === stage.key);
    const totalBudget = stageProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = stageProjects.reduce((sum, p) => sum + p.actualSpend, 0);
    const avgProgress = stageProjects.length > 0 
      ? stageProjects.reduce((sum, p) => sum + p.completionPercentage, 0) / stageProjects.length 
      : 0;
    
    return {
      ...stage,
      projectCount: stageProjects.length,
      totalBudget,
      totalSpent,
      avgProgress,
      projects: stageProjects,
      criticalCount: stageProjects.filter(p => p.priority === 'Critical').length,
      highRiskCount: stageProjects.filter(p => p.risks === 'High').length
    };
  });

  const maxProjects = Math.max(...funnelData.map(stage => stage.projectCount));
  const totalProjects = filteredProjects.length;

  if (totalProjects === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Funnel Analysis</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No projects available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Funnel Analysis</h3>
          <p className="text-sm text-gray-600">Project distribution across lifecycle stages</p>
        </div>
        <div className="text-sm text-gray-600">
          Total Projects: <span className="font-medium text-gray-900">{totalProjects}</span>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="relative mb-8">
        <div className="space-y-2">
          {funnelData.map((stage, index) => {
            const widthPercentage = maxProjects > 0 ? (stage.projectCount / maxProjects) * 100 : 0;
            const conversionRate = totalProjects > 0 ? (stage.projectCount / totalProjects) * 100 : 0;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="relative">
                {/* Stage Bar */}
                <div className="flex items-center">
                  <div className="w-32 flex-shrink-0">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Icon className="w-4 h-4" />
                      {stage.label}
                    </div>
                  </div>
                  
                  <div className="flex-1 relative">
                    {/* Background bar */}
                    <div className="h-12 bg-gray-100 rounded-lg relative overflow-hidden">
                      {/* Colored bar */}
                      <div
                        className={cn("h-full rounded-lg transition-all duration-700 flex items-center justify-between px-4", stage.color)}
                        style={{ width: `${Math.max(widthPercentage, 8)}%` }}
                      >
                        <div className="text-white font-medium text-sm">
                          {stage.projectCount} projects
                        </div>
                        <div className="text-white text-xs">
                          {conversionRate.toFixed(1)}%
                        </div>
                      </div>
                      
                      {/* Conversion rate label */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-600">
                        {formatCurrency(stage.totalBudget)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics below bar */}
                <div className="ml-32 mt-1 flex items-center gap-4 text-xs text-gray-500">
                  {stage.totalBudget > 0 && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Spent: {formatCurrency(stage.totalSpent)}
                    </span>
                  )}
                  {stage.avgProgress > 0 && (
                    <span>Avg Progress: {stage.avgProgress.toFixed(1)}%</span>
                  )}
                  {stage.criticalCount > 0 && (
                    <span className="text-red-600 font-medium">
                      {stage.criticalCount} Critical
                    </span>
                  )}
                  {stage.highRiskCount > 0 && (
                    <span className="text-orange-600 font-medium">
                      {stage.highRiskCount} High Risk
                    </span>
                  )}
                </div>

                {/* Connector arrow for next stage */}
                {index < funnelData.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-600 font-medium">Active Conversion</div>
              <div className="text-2xl font-bold text-blue-900">
                {totalProjects > 0 
                  ? ((funnelData.find(s => s.key === 'Active')?.projectCount || 0) / totalProjects * 100).toFixed(1)
                  : 0}%
              </div>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-600 font-medium">Success Rate</div>
              <div className="text-2xl font-bold text-green-900">
                {totalProjects > 0 
                  ? ((funnelData.find(s => s.key === 'Completed')?.projectCount || 0) / totalProjects * 100).toFixed(1)
                  : 0}%
              </div>
            </div>
            <TrendingDown className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-600 font-medium">Pipeline Value</div>
              <div className="text-2xl font-bold text-purple-900">
                {formatCurrency(funnelData.reduce((sum, stage) => sum + stage.totalBudget, 0))}
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Detailed Stage Breakdown */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-800">Stage Details</h4>
        {funnelData.filter(stage => stage.projectCount > 0).map(stage => (
          <div key={stage.key} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", stage.color)}></div>
                <h5 className="font-medium text-gray-900">{stage.label}</h5>
                <span className="text-sm text-gray-500">({stage.projectCount} projects)</span>
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(stage.totalBudget)} total budget
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stage.projects.slice(0, 6).map(project => (
                <div key={project.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{project.name}</div>
                    <div className="text-gray-600 text-xs">{project.projectManager}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      getPriorityColorClass(project.priority)
                    )}>
                      {project.priority}
                    </div>
                  </div>
                </div>
              ))}
              {stage.projects.length > 6 && (
                <div className="p-2 bg-gray-50 rounded text-sm text-center text-gray-600">
                  +{stage.projects.length - 6} more projects
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Funnel Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-3">Funnel Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Largest Stage:</span>
            <span className="ml-2 font-medium text-gray-900">
              {funnelData.reduce((max, stage) => 
                stage.projectCount > max.projectCount ? stage : max
              ).label}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Pipeline Value:</span>
            <span className="ml-2 font-medium text-gray-900">
              {formatCurrency(funnelData.reduce((sum, stage) => sum + stage.totalBudget, 0))}
            </span>
          </div>
          <div>
            <span className="text-gray-600">At-Risk Projects:</span>
            <span className="ml-2 font-medium text-red-600">
              {funnelData.reduce((sum, stage) => sum + stage.highRiskCount, 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Critical Priority:</span>
            <span className="ml-2 font-medium text-red-600">
              {funnelData.reduce((sum, stage) => sum + stage.criticalCount, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
