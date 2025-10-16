'use client';

import React from 'react';
import { 
  FolderOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useFilter } from '@/contexts/FilterContext';
import { formatCurrency, formatPercentage } from '@/lib/utils';

function getBudgetVarianceColor(variance: number): string {
  if (variance < 0) return 'green';
  if (variance > 10) return 'red';
  return 'yellow';
}

function getBudgetVarianceTrend(variance: number): string {
  if (variance < 0) return 'Under budget';
  if (variance > 10) return 'Over budget';
  return 'On budget';
}

export function KPICards() {
  const { filteredProjects } = useFilter();

  // Calculate KPIs from filtered projects
  const totalProjects = filteredProjects.length;
  const activeProjects = filteredProjects.filter(p => p.status === 'Active').length;
  const completedProjects = filteredProjects.filter(p => p.status === 'Completed').length;
  const plannedProjects = filteredProjects.filter(p => p.status === 'Planning').length;
  
  const totalBudget = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = filteredProjects.reduce((sum, p) => sum + p.actualSpend, 0);
  const budgetVariance = totalBudget > 0 ? ((totalSpent - totalBudget) / totalBudget) * 100 : 0;
  
  const avgCompletion = totalProjects > 0 
    ? filteredProjects.reduce((sum, p) => sum + p.completionPercentage, 0) / totalProjects 
    : 0;
  
  const criticalProjects = filteredProjects.filter(p => p.priority === 'Critical').length;
  const highRiskProjects = filteredProjects.filter(p => p.risks === 'High').length;

  const kpis = [
    {
      title: 'Total Projects',
      value: totalProjects.toString(),
      icon: FolderOpen,
      color: 'blue',
      trend: '+2 this month'
    },
    {
      title: 'Active Projects',
      value: activeProjects.toString(),
      icon: Play,
      color: 'green',
      trend: `${plannedProjects} in planning`
    },
    {
      title: 'Completed Projects',
      value: completedProjects.toString(),
      icon: CheckCircle,
      color: 'emerald',
      trend: '+1 this quarter'
    },
    {
      title: 'Avg. Completion',
      value: formatPercentage(avgCompletion),
      icon: Clock,
      color: 'indigo',
      trend: avgCompletion > 50 ? 'On track' : 'Behind schedule'
    },
    {
      title: 'Total Budget',
      value: formatCurrency(totalBudget),
      icon: DollarSign,
      color: 'purple',
      trend: formatCurrency(totalSpent) + ' spent'
    },
    {
      title: 'Budget Variance',
      value: formatPercentage(Math.abs(budgetVariance)),
      icon: budgetVariance < 0 ? TrendingDown : TrendingUp,
      color: getBudgetVarianceColor(budgetVariance),
      trend: getBudgetVarianceTrend(budgetVariance)
    },
    {
      title: 'Critical Projects',
      value: criticalProjects.toString(),
      icon: AlertTriangle,
      color: 'red',
      trend: `${highRiskProjects} high risk`
    },
    {
      title: 'Resource Util.',
      value: '78.5%',
      icon: Users,
      color: 'orange',
      trend: '↑ 5% from last month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  trend: string;
}

function KPICard({ title, value, icon: Icon, color, trend }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    emerald: 'bg-emerald-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    purple: 'bg-purple-500 text-white',
    red: 'bg-red-500 text-white',
    orange: 'bg-orange-500 text-white',
    yellow: 'bg-yellow-500 text-white'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{trend}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
