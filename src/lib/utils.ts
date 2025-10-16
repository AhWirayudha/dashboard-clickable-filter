import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function calculateProjectHealth(project: {
  completionPercentage: number;
  budget: number;
  actualSpend: number;
  endDate: string;
}): 'excellent' | 'good' | 'warning' | 'critical' {
  const budgetVariance = ((project.actualSpend - project.budget) / project.budget) * 100;
  const daysToEnd = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverBudget = budgetVariance > 10;
  const isBehindSchedule = project.completionPercentage < 50 && daysToEnd < 90;
  
  if (isOverBudget && isBehindSchedule) return 'critical';
  if (isOverBudget || isBehindSchedule) return 'warning';
  if (project.completionPercentage > 80 && budgetVariance < 5) return 'excellent';
  return 'good';
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'active': return 'bg-blue-100 text-blue-800';
    case 'planning': return 'bg-yellow-100 text-yellow-800';
    case 'on hold': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function getFELStageColor(stage: string): string {
  switch (stage) {
    case 'FEL 1': return 'bg-purple-100 text-purple-800';
    case 'FEL 2': return 'bg-indigo-100 text-indigo-800';
    case 'FEL 3': return 'bg-blue-100 text-blue-800';
    case 'Execute': return 'bg-orange-100 text-orange-800';
    case 'Operate': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}
