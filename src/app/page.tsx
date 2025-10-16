'use client';

import { FilterProvider } from '@/contexts/FilterContext';
import { DashboardFilters } from '@/components/DashboardFilters';
import { KPICards } from '@/components/KPICards';
import { SCurveChart } from '@/components/SCurveChart';
import { GanttChart } from '@/components/GanttChart';
import { FELPipeline } from '@/components/FELPipeline';
import { FELFunnelChart } from '@/components/FELFunnelChart';
import { ResourceAndBudgetCharts } from '@/components/ResourceAndBudgetCharts';
import { ClientTimestamp } from '@/components/ClientTimestamp';
import { BarChart3, Settings, Download, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PMO Dashboard</h1>
                  <p className="text-sm text-gray-600">Project Management Office Analytics</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Filters Section */}
          <DashboardFilters />
          
          {/* KPI Cards */}
          <KPICards />
          
          {/* Charts Grid */}
          <div className="space-y-6">
            {/* FEL Pipeline */}
            <FELPipeline />
            
            {/* FEL Funnel Pipeline Chart with Interactive Filters */}
            <FELFunnelChart />
            
            {/* S-Curve Chart */}
            <SCurveChart />
            
            {/* Resource & Budget Charts */}
            <ResourceAndBudgetCharts />
            
            {/* Gantt Chart */}
            <GanttChart />
          </div>
          
          {/* Footer */}
          <footer className="mt-8 py-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p>
                PMO Dashboard - Real-time Project Management Analytics{' '}
                <span className="mx-2">•</span>{' '}
                <span suppressHydrationWarning>
                  Last updated: <ClientTimestamp />
                </span>
              </p>
            </div>
          </footer>
        </main>
      </div>
    </FilterProvider>
  );
}
