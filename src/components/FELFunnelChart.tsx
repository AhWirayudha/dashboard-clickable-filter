'use client';

import React from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { cn, formatCurrency } from '@/lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Settings,
  Play,
  CheckCircle,
  Building2,
  Factory
} from 'lucide-react';

const FEL_STAGES = [
  { 
    key: 'FEL 1', 
    label: 'FEL 1 - Opportunity Identification', 
    color: 'bg-purple-500', 
    icon: Calendar,
    description: 'Initial concept and opportunity assessment'
  },
  { 
    key: 'FEL 2', 
    label: 'FEL 2 - Concept Development', 
    color: 'bg-blue-500', 
    icon: Settings,
    description: 'Detailed concept development and feasibility'
  },
  { 
    key: 'FEL 3', 
    label: 'FEL 3 - Basic Engineering', 
    color: 'bg-indigo-500', 
    icon: Users,
    description: 'Detailed design and project definition'
  },
  { 
    key: 'Execute', 
    label: 'Execute - Implementation', 
    color: 'bg-orange-500', 
    icon: Play,
    description: 'Project execution and construction'
  },
  { 
    key: 'Operate', 
    label: 'Operate - Operations', 
    color: 'bg-green-500', 
    icon: CheckCircle,
    description: 'Operational and handover phase'
  },
] as const;

const BUSINESS_UNIT_COLORS = [
  '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'
];

const COMPANY_COLORS = [
  '#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626', '#4F46E5'
];

function getPriorityColorClass(priority: string): string {
  if (priority === 'Critical') return 'bg-red-100 text-red-800';
  if (priority === 'High') return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-800';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      budget: number;
      percentage: number;
    };
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">Projects: {data.value}</p>
        <p className="text-sm text-gray-600">Budget: {formatCurrency(data.budget)}</p>
        <p className="text-sm text-gray-600">Percentage: {data.percentage.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export function FELFunnelChart() {
  const { filteredProjects, state, dispatch } = useFilter();
  // Removed unused activeChart state

  const funnelData = FEL_STAGES.map(stage => {
    const stageProjects = filteredProjects.filter(p => p.felStage === stage.key);
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

  // Prepare pie chart data for business units
  const businessUnitData = React.useMemo(() => {
    const units = [...new Set(filteredProjects.map(p => p.businessUnit))];
    return units.map((unit, index) => {
      const unitProjects = filteredProjects.filter(p => p.businessUnit === unit);
      const totalBudget = unitProjects.reduce((sum, p) => sum + p.budget, 0);
      const percentage = filteredProjects.length > 0 ? (unitProjects.length / filteredProjects.length) * 100 : 0;
      
      return {
        name: unit,
        value: unitProjects.length,
        budget: totalBudget,
        percentage,
        color: BUSINESS_UNIT_COLORS[index % BUSINESS_UNIT_COLORS.length]
      };
    });
  }, [filteredProjects]);

  // Prepare pie chart data for companies
  const companyData = React.useMemo(() => {
    const companies = [...new Set(filteredProjects.map(p => p.company))];
    return companies.map((company, index) => {
      const companyProjects = filteredProjects.filter(p => p.company === company);
      const totalBudget = companyProjects.reduce((sum, p) => sum + p.budget, 0);
      const percentage = filteredProjects.length > 0 ? (companyProjects.length / filteredProjects.length) * 100 : 0;
      
      return {
        name: company,
        value: companyProjects.length,
        budget: totalBudget,
        percentage,
        color: COMPANY_COLORS[index % COMPANY_COLORS.length]
      };
    });
  }, [filteredProjects]);

  const maxProjects = Math.max(...funnelData.map(stage => stage.projectCount));
  const totalProjects = filteredProjects.length;

  const handlePieClick = (data: { name: string }, type: 'businessUnit' | 'company') => {
    if (type === 'businessUnit') {
      dispatch({ type: 'TOGGLE_BUSINESS_UNIT', payload: data.name });
    } else if (type === 'company') {
      dispatch({ type: 'TOGGLE_COMPANY', payload: data.name });
    }
  };

  if (totalProjects === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">FEL Funnel Analysis</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No projects available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interactive Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Unit Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Business Units</h3>
            </div>
            <span className="text-sm text-gray-500">Click to filter</span>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={businessUnitData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  onClick={(data) => handlePieClick(data, 'businessUnit')}
                  className="cursor-pointer"
                >
                  {businessUnitData.map((entry, index) => (
                    <Cell 
                      key={`business-unit-${index}`} 
                      fill={entry.color}
                      className={cn(
                        "transition-opacity duration-200",
                        state.selectedBusinessUnits.length > 0 && 
                        !state.selectedBusinessUnits.includes(entry.name) 
                          ? "opacity-50" 
                          : "opacity-100 hover:opacity-80"
                      )}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Selected Business Units */}
          {state.selectedBusinessUnits.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {state.selectedBusinessUnits.map(unit => (
                  <span
                    key={unit}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 cursor-pointer"
                    onClick={() => dispatch({ type: 'TOGGLE_BUSINESS_UNIT', payload: unit })}
                  >
                    {unit} ×
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Company Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Companies</h3>
            </div>
            <span className="text-sm text-gray-500">Click to filter</span>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={companyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  onClick={(data) => handlePieClick(data, 'company')}
                  className="cursor-pointer"
                >
                  {companyData.map((entry, index) => (
                    <Cell 
                      key={`company-${index}`} 
                      fill={entry.color}
                      className={cn(
                        "transition-opacity duration-200",
                        state.selectedCompanies.length > 0 && 
                        !state.selectedCompanies.includes(entry.name) 
                          ? "opacity-50" 
                          : "opacity-100 hover:opacity-80"
                      )}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Selected Companies */}
          {state.selectedCompanies.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {state.selectedCompanies.map(company => (
                  <span
                    key={company}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 cursor-pointer"
                    onClick={() => dispatch({ type: 'TOGGLE_COMPANY', payload: company })}
                  >
                    {company} ×
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FEL Funnel Visualization */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">FEL Funnel Analysis</h3>
            <p className="text-sm text-gray-600">Project distribution across FEL stages</p>
          </div>
          <div className="text-sm text-gray-600">
            Total Projects: <span className="font-medium text-gray-900">{totalProjects}</span>
          </div>
        </div>

        {/* Funnel Bars */}
        <div className="relative mb-8">
          <div className="space-y-3">
            {funnelData.map((stage, index) => {
              const widthPercentage = maxProjects > 0 ? (stage.projectCount / maxProjects) * 100 : 0;
              const conversionRate = totalProjects > 0 ? (stage.projectCount / totalProjects) * 100 : 0;
              const Icon = stage.icon;

              return (
                <div key={stage.key} className="relative">
                  {/* Stage Header */}
                  <div className="flex items-center mb-2">
                    <div className="w-40 flex-shrink-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Icon className="w-4 h-4" />
                        <div>
                          <div>{stage.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{stage.description}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center ml-40">
                    <div className="flex-1 relative">
                      <div className="h-16 bg-gray-100 rounded-lg relative overflow-hidden">
                        <div
                          className={cn("h-full rounded-lg transition-all duration-700 flex items-center px-4", stage.color)}
                          style={{ width: `${Math.max(widthPercentage, 15)}%` }}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="text-white font-medium text-sm">
                              {stage.projectCount} projects
                            </div>
                            {widthPercentage > 25 && (
                              <div className="text-white text-xs">
                                {conversionRate.toFixed(1)}%
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Budget and percentage outside the bar when bar is narrow */}
                        <div className="absolute right-3 top-2 text-xs text-gray-600">
                          {formatCurrency(stage.totalBudget)}
                        </div>
                        {widthPercentage <= 25 && (
                          <div className="absolute right-3 bottom-2 text-xs text-gray-700 font-medium">
                            {conversionRate.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stage Metrics */}
                  <div className="ml-40 mt-2 flex items-center gap-6 text-xs text-gray-500">
                    {stage.totalBudget > 0 && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Spent: {formatCurrency(stage.totalSpent)} ({((stage.totalSpent / stage.totalBudget) * 100).toFixed(1)}%)
                      </span>
                    )}
                    {stage.avgProgress > 0 && (
                      <span>Avg Progress: {stage.avgProgress.toFixed(1)}%</span>
                    )}
                    {stage.criticalCount > 0 && (
                      <span className="text-red-600 font-medium">
                        {stage.criticalCount} Critical Priority
                      </span>
                    )}
                    {stage.highRiskCount > 0 && (
                      <span className="text-orange-600 font-medium">
                        {stage.highRiskCount} High Risk  
                      </span>
                    )}
                  </div>

                  {/* Connector arrow */}
                  {index < funnelData.length - 1 && (
                    <div className="flex justify-center my-4 ml-40">
                      <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-gray-400"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FEL Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-600 font-medium">FEL 1-2 Rate</div>
                <div className="text-2xl font-bold text-purple-900">
                  {totalProjects > 0 
                    ? (((funnelData.find(s => s.key === 'FEL 1')?.projectCount || 0) + 
                        (funnelData.find(s => s.key === 'FEL 2')?.projectCount || 0)) / totalProjects * 100).toFixed(1)
                    : 0}%
                </div>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 font-medium">Execution Rate</div>
                <div className="text-2xl font-bold text-blue-900">
                  {totalProjects > 0 
                    ? ((funnelData.find(s => s.key === 'Execute')?.projectCount || 0) / totalProjects * 100).toFixed(1)
                    : 0}%
                </div>
              </div>
              <Play className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 font-medium">Success Rate</div>
                <div className="text-2xl font-bold text-green-900">
                  {totalProjects > 0 
                    ? ((funnelData.find(s => s.key === 'Operate')?.projectCount || 0) / totalProjects * 100).toFixed(1)
                    : 0}%
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-orange-600 font-medium">Pipeline Value</div>
                <div className="text-2xl font-bold text-orange-900">
                  {formatCurrency(funnelData.reduce((sum, stage) => sum + stage.totalBudget, 0))}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* FEL Stage Details */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">FEL Stage Details</h4>
          {funnelData.filter(stage => stage.projectCount > 0).map(stage => (
            <div key={stage.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("w-4 h-4 rounded-full", stage.color)}></div>
                  <div>
                    <h5 className="font-medium text-gray-900">{stage.label}</h5>
                    <p className="text-xs text-gray-500">{stage.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">({stage.projectCount} projects)</span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(stage.totalBudget)} total budget
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stage.projects.slice(0, 6).map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{project.name}</div>
                      <div className="text-gray-600 text-xs">
                        {project.projectManager} • {project.businessUnit}
                      </div>
                      <div className="text-gray-500 text-xs">{project.company}</div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium mb-1",
                        getPriorityColorClass(project.priority)
                      )}>
                        {project.priority}
                      </div>
                      <div className="text-xs text-gray-500">
                        {project.completionPercentage}% complete
                      </div>
                    </div>
                  </div>
                ))}
                {stage.projects.length > 6 && (
                  <div className="p-3 bg-gray-50 rounded text-sm text-center text-gray-600">
                    +{stage.projects.length - 6} more projects
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
