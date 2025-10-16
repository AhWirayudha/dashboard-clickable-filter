'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { projects, Project } from '@/data/sampleData';

export interface FilterState {
  selectedProjects: string[];
  selectedStatuses: string[];
  selectedFELStages: string[];
  selectedDepartments: string[];
  selectedBusinessUnits: string[];
  selectedCompanies: string[];
  selectedPriorities: string[];
  selectedCategories: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
  searchQuery: string;
}

type FilterAction =
  | { type: 'TOGGLE_PROJECT'; payload: string }
  | { type: 'TOGGLE_STATUS'; payload: string }
  | { type: 'TOGGLE_FEL_STAGE'; payload: string }
  | { type: 'TOGGLE_DEPARTMENT'; payload: string }
  | { type: 'TOGGLE_BUSINESS_UNIT'; payload: string }
  | { type: 'TOGGLE_COMPANY'; payload: string }
  | { type: 'TOGGLE_PRIORITY'; payload: string }
  | { type: 'TOGGLE_CATEGORY'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: { start: string | null; end: string | null } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_QUICK_FILTER'; payload: 'active' | 'critical' | 'at-risk' | 'completed' };

const initialState: FilterState = {
  selectedProjects: [],
  selectedStatuses: [],
  selectedFELStages: [],
  selectedDepartments: [],
  selectedBusinessUnits: [],
  selectedCompanies: [],
  selectedPriorities: [],
  selectedCategories: [],
  dateRange: {
    start: null,
    end: null,
  },
  searchQuery: '',
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'TOGGLE_PROJECT':
      return {
        ...state,
        selectedProjects: state.selectedProjects.includes(action.payload)
          ? state.selectedProjects.filter(id => id !== action.payload)
          : [...state.selectedProjects, action.payload],
      };
    case 'TOGGLE_STATUS':
      return {
        ...state,
        selectedStatuses: state.selectedStatuses.includes(action.payload)
          ? state.selectedStatuses.filter(status => status !== action.payload)
          : [...state.selectedStatuses, action.payload],
      };
    case 'TOGGLE_FEL_STAGE':
      return {
        ...state,
        selectedFELStages: state.selectedFELStages.includes(action.payload)
          ? state.selectedFELStages.filter(stage => stage !== action.payload)
          : [...state.selectedFELStages, action.payload],
      };
    case 'TOGGLE_DEPARTMENT':
      return {
        ...state,
        selectedDepartments: state.selectedDepartments.includes(action.payload)
          ? state.selectedDepartments.filter(dept => dept !== action.payload)
          : [...state.selectedDepartments, action.payload],
      };
    case 'TOGGLE_BUSINESS_UNIT':
      return {
        ...state,
        selectedBusinessUnits: state.selectedBusinessUnits.includes(action.payload)
          ? state.selectedBusinessUnits.filter(unit => unit !== action.payload)
          : [...state.selectedBusinessUnits, action.payload],
      };
    case 'TOGGLE_COMPANY':
      return {
        ...state,
        selectedCompanies: state.selectedCompanies.includes(action.payload)
          ? state.selectedCompanies.filter(company => company !== action.payload)
          : [...state.selectedCompanies, action.payload],
      };
    case 'TOGGLE_PRIORITY':
      return {
        ...state,
        selectedPriorities: state.selectedPriorities.includes(action.payload)
          ? state.selectedPriorities.filter(priority => priority !== action.payload)
          : [...state.selectedPriorities, action.payload],
      };
    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        selectedCategories: state.selectedCategories.includes(action.payload)
          ? state.selectedCategories.filter(category => category !== action.payload)
          : [...state.selectedCategories, action.payload],
      };
    case 'SET_DATE_RANGE':
      return {
        ...state,
        dateRange: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'CLEAR_FILTERS':
      return initialState;
    case 'SET_QUICK_FILTER':
      switch (action.payload) {
        case 'active':
          return {
            ...initialState,
            selectedStatuses: ['Active'],
          };
        case 'critical':
          return {
            ...initialState,
            selectedPriorities: ['Critical'],
          };
        case 'at-risk':
          return {
            ...initialState,
            selectedStatuses: ['Active'],
            selectedPriorities: ['High', 'Critical'],
          };
        case 'completed':
          return {
            ...initialState,
            selectedStatuses: ['Completed'],
          };
        default:
          return state;
      }
    default:
      return state;
  }
}

interface FilterContextType {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  filteredProjects: Project[];
  clearFilters: () => void;
  setQuickFilter: (filter: 'active' | 'critical' | 'at-risk' | 'completed') => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const filteredProjects = React.useMemo(() => {
    let filtered = projects;

    // Filter by selected projects
    if (state.selectedProjects.length > 0) {
      filtered = filtered.filter(project => state.selectedProjects.includes(project.id));
    }

    // Filter by status
    if (state.selectedStatuses.length > 0) {
      filtered = filtered.filter(project => state.selectedStatuses.includes(project.status));
    }

    // Filter by FEL stage
    if (state.selectedFELStages.length > 0) {
      filtered = filtered.filter(project => state.selectedFELStages.includes(project.felStage));
    }

    // Filter by department
    if (state.selectedDepartments.length > 0) {
      filtered = filtered.filter(project => state.selectedDepartments.includes(project.department));
    }

    // Filter by business unit
    if (state.selectedBusinessUnits.length > 0) {
      filtered = filtered.filter(project => state.selectedBusinessUnits.includes(project.businessUnit));
    }

    // Filter by company
    if (state.selectedCompanies.length > 0) {
      filtered = filtered.filter(project => state.selectedCompanies.includes(project.company));
    }

    // Filter by priority
    if (state.selectedPriorities.length > 0) {
      filtered = filtered.filter(project => state.selectedPriorities.includes(project.priority));
    }

    // Filter by category
    if (state.selectedCategories.length > 0) {
      filtered = filtered.filter(project => state.selectedCategories.includes(project.category));
    }

    // Filter by date range
    if (state.dateRange.start && state.dateRange.end) {
      const startDate = new Date(state.dateRange.start);
      const endDate = new Date(state.dateRange.end);
      filtered = filtered.filter(project => {
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);
        return (
          (projectStart >= startDate && projectStart <= endDate) ||
          (projectEnd >= startDate && projectEnd <= endDate) ||
          (projectStart <= startDate && projectEnd >= endDate)
        );
      });
    }

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.projectManager.toLowerCase().includes(query) ||
        project.department.toLowerCase().includes(query) ||
        project.businessUnit.toLowerCase().includes(query) ||
        project.company.toLowerCase().includes(query) ||
        project.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [state]);

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const setQuickFilter = (filter: 'active' | 'critical' | 'at-risk' | 'completed') => {
    dispatch({ type: 'SET_QUICK_FILTER', payload: filter });
  };

  return (
    <FilterContext.Provider
      value={{
        state,
        dispatch,
        filteredProjects,
        clearFilters,
        setQuickFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
