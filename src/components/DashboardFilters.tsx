'use client';

import React from 'react';
import { Search, Filter, X, Calendar, BarChart3 } from 'lucide-react';
import { useFilter } from '@/contexts/FilterContext';
import { projects } from '@/data/sampleData';
import { cn, getStatusColor, getFELStageColor, getPriorityColor } from '@/lib/utils';

export function DashboardFilters() {
  const { state, dispatch, clearFilters, setQuickFilter } = useFilter();

  const uniqueStatuses = [...new Set(projects.map(p => p.status))];
  const uniqueFELStages = [...new Set(projects.map(p => p.felStage))];
  const uniqueDepartments = [...new Set(projects.map(p => p.department))];
  const uniquePriorities = [...new Set(projects.map(p => p.priority))];
  const uniqueCategories = [...new Set(projects.map(p => p.category))];

  const hasActiveFilters = state.selectedProjects.length > 0 ||
    state.selectedStatuses.length > 0 ||
    state.selectedFELStages.length > 0 ||
    state.selectedDepartments.length > 0 ||
    state.selectedPriorities.length > 0 ||
    state.selectedCategories.length > 0 ||
    state.dateRange.start ||
    state.searchQuery;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'active', label: 'Active Projects', icon: BarChart3 },
            { key: 'critical', label: 'Critical Priority', icon: Calendar },
            { key: 'at-risk', label: 'At Risk', icon: Filter },
            { key: 'completed', label: 'Completed', icon: Calendar }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setQuickFilter(key as 'active' | 'critical' | 'at-risk' | 'completed')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects, managers, departments..."
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <FilterGroup
          title="Status"
          options={uniqueStatuses}
          selectedValues={state.selectedStatuses}
          onToggle={(value) => dispatch({ type: 'TOGGLE_STATUS', payload: value })}
          getOptionColor={getStatusColor}
        />

        {/* FEL Stage Filter */}
        <FilterGroup
          title="FEL Stage"
          options={uniqueFELStages}
          selectedValues={state.selectedFELStages}
          onToggle={(value) => dispatch({ type: 'TOGGLE_FEL_STAGE', payload: value })}
          getOptionColor={getFELStageColor}
        />

        {/* Priority Filter */}
        <FilterGroup
          title="Priority"
          options={uniquePriorities}
          selectedValues={state.selectedPriorities}
          onToggle={(value) => dispatch({ type: 'TOGGLE_PRIORITY', payload: value })}
          getOptionColor={getPriorityColor}
        />

        {/* Department Filter */}
        <FilterGroup
          title="Department"
          options={uniqueDepartments}
          selectedValues={state.selectedDepartments}
          onToggle={(value) => dispatch({ type: 'TOGGLE_DEPARTMENT', payload: value })}
        />

        {/* Category Filter */}
        <FilterGroup
          title="Category"
          options={uniqueCategories}
          selectedValues={state.selectedCategories}
          onToggle={(value) => dispatch({ type: 'TOGGLE_CATEGORY', payload: value })}
        />
      </div>
    </div>
  );
}

interface FilterGroupProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  getOptionColor?: (value: string) => string;
}

function FilterGroup({ 
  title, 
  options, 
  selectedValues, 
  onToggle, 
  getOptionColor 
}: FilterGroupProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      <div className="space-y-1">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded-md text-sm transition-all",
                isSelected
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "hover:bg-gray-50 text-gray-600"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {getOptionColor && (
                  <span className={cn("w-2 h-2 rounded-full", getOptionColor(option).replace('bg-', 'bg-').replace('text-', 'bg-').split(' ')[0])} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
