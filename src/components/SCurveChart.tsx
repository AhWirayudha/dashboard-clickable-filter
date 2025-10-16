'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFilter } from '@/contexts/FilterContext';
import { sCurveData } from '@/data/sampleData';
import { formatDate, formatPercentage, formatCurrency } from '@/lib/utils';

export function SCurveChart() {
  const { filteredProjects } = useFilter();

  const chartData = useMemo(() => {
    // Filter S-curve data based on selected projects
    const projectIds = filteredProjects.map(p => p.id);
    const filteredSCurveData = sCurveData.filter(data => 
      projectIds.includes(data.projectId)
    );

    // Group by date and aggregate
    const dataByDate = filteredSCurveData.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          plannedProgress: 0,
          actualProgress: 0,
          plannedCost: 0,
          actualCost: 0,
          projectCount: 0
        };
      }
      
      acc[date].plannedProgress += item.plannedProgress;
      acc[date].actualProgress += item.actualProgress;
      acc[date].plannedCost += item.plannedCost;
      acc[date].actualCost += item.actualCost;
      acc[date].projectCount += 1;
      
      return acc;
    }, {} as Record<string, {
      date: string;
      plannedProgress: number;
      actualProgress: number;
      plannedCost: number;
      actualCost: number;
      projectCount: number;
    }>);

    // Convert to array and calculate averages
    const result = Object.values(dataByDate)
      .map((item) => ({
        date: item.date,
        formattedDate: formatDate(item.date),
        plannedProgress: item.projectCount > 0 ? item.plannedProgress / item.projectCount : 0,
        actualProgress: item.projectCount > 0 ? item.actualProgress / item.projectCount : 0,
        plannedCost: item.plannedCost,
        actualCost: item.actualCost,
        progressVariance: item.projectCount > 0 
          ? (item.actualProgress / item.projectCount) - (item.plannedProgress / item.projectCount)
          : 0
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return result;
  }, [filteredProjects]);

  interface SCurveTooltipPayload {
    name: string;
    value: number;
    dataKey: string;
    color: string;
  }

  interface SCurveTooltipProps {
    active?: boolean;
    payload?: SCurveTooltipPayload[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: SCurveTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span>{' '}
              {entry.dataKey.includes('Cost') 
                ? formatCurrency(entry.value)
                : formatPercentage(entry.value)
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">S-Curve Analysis</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available for selected projects
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">S-Curve Analysis</h3>
          <p className="text-sm text-gray-600">Progress and cost tracking over time</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Planned Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Actual Progress</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress S-Curve */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Progress Tracking (%)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="plannedProgress" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Planned Progress"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="actualProgress" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Actual Progress"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cost S-Curve */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Cost Tracking ($)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="plannedCost" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Planned Cost"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="actualCost" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Actual Cost"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Avg. Progress Variance:</span>
            <span className={`ml-2 font-medium ${
              chartData.length > 0 && chartData[chartData.length - 1]?.progressVariance > 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {chartData.length > 0 
                ? formatPercentage(chartData[chartData.length - 1]?.progressVariance || 0)
                : '0%'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-600">Projects Tracked:</span>
            <span className="ml-2 font-medium text-gray-900">{filteredProjects.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Data Points:</span>
            <span className="ml-2 font-medium text-gray-900">{chartData.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
