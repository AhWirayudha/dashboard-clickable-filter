'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFilter } from '@/contexts/FilterContext';
import { resourceAllocation, budgetByCategory } from '@/data/sampleData';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

function getValueSuffix(dataKey: string | undefined, value: number): string {
  if (!dataKey) return value.toString();
  
  if (dataKey.includes('budget') || dataKey.includes('spent') || dataKey.includes('remaining')) {
    return formatCurrency(value);
  }
  
  if (dataKey.includes('utilized') || dataKey.includes('allocated')) {
    return `${value}%`;
  }
  
  return value.toString();
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span>{' '}
            {getValueSuffix(entry.dataKey, entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.payload.category}</p>
        <p className="text-sm text-gray-600">
          Budget: {formatCurrency(data.payload.budget)}
        </p>
        <p className="text-sm text-gray-600">
          Spent: {formatCurrency(data.payload.spent)}
        </p>
        <p className="text-sm text-gray-600">
          Projects: {data.payload.projects}
        </p>
      </div>
    );
  }
  return null;
};

export function ResourceAndBudgetCharts() {
  const { filteredProjects } = useFilter();

  // Calculate budget data for filtered projects
  const budgetData = React.useMemo(() => {
    const categoryBudgets = budgetByCategory.map(category => {
      const categoryProjects = filteredProjects.filter(p => p.category === category.category);
      const totalBudget = categoryProjects.reduce((sum, p) => sum + p.budget, 0);
      const totalSpent = categoryProjects.reduce((sum, p) => sum + p.actualSpend, 0);
      
      return {
        category: category.category,
        budget: totalBudget,
        spent: totalSpent,
        remaining: Math.max(0, totalBudget - totalSpent),
        variance: totalBudget > 0 ? ((totalSpent - totalBudget) / totalBudget) * 100 : 0,
        projects: categoryProjects.length
      };
    }).filter(item => item.budget > 0);

    return categoryBudgets;
  }, [filteredProjects]);

  // Calculate resource utilization for filtered projects
  const resourceData = React.useMemo(() => {
    const departments = [...new Set(filteredProjects.map(p => p.department))];
    return resourceAllocation.filter(resource => 
      departments.includes(resource.department) || filteredProjects.length === 0
    );
  }, [filteredProjects]);



  if (filteredProjects.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization</h3>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Analysis</h3>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Resource Utilization Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resource Utilization</h3>
            <p className="text-sm text-gray-600">Department capacity and allocation</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="department" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="capacity" fill="#e5e7eb" name="Capacity" />
            <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" />
            <Bar dataKey="utilized" fill="#10b981" name="Utilized" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {resourceData.reduce((sum, r) => sum + r.utilized, 0)}
            </div>
            <div className="text-gray-600">Total Utilized</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {resourceData.reduce((sum, r) => sum + r.capacity, 0)}
            </div>
            <div className="text-gray-600">Total Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {resourceData.length > 0 
                ? Math.round((resourceData.reduce((sum, r) => sum + r.utilized, 0) / 
                   resourceData.reduce((sum, r) => sum + r.capacity, 0)) * 100)
                : 0}%
            </div>
            <div className="text-gray-600">Avg Utilization</div>
          </div>
        </div>
      </div>

      {/* Budget Analysis Charts */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Budget Analysis</h3>
            <p className="text-sm text-gray-600">Spending by category</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="budget"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Budget Summary */}
          <div className="space-y-2">
            {budgetData.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium text-gray-900">{formatCurrency(item.budget)}</div>
                  <div className="text-gray-600">
                    {item.variance >= 0 ? '+' : ''}{item.variance.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
