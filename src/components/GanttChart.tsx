'use client';

import React, { useMemo } from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { ganttTasks, projects } from '@/data/sampleData';
import { formatDate, cn, getPriorityColor } from '@/lib/utils';
import { Calendar, User, CheckCircle } from 'lucide-react';

export function GanttChart() {
  const { filteredProjects } = useFilter();

  const { filteredTasks, dateRange, totalDays } = useMemo(() => {
    const projectIds = filteredProjects.map(p => p.id);
    const tasks = ganttTasks.filter(task => projectIds.includes(task.projectId));
    
    if (tasks.length === 0) {
      return { filteredTasks: [], dateRange: { start: new Date(), end: new Date() }, totalDays: 0 };
    }

    const allDates = [
      ...tasks.map(task => new Date(task.startDate)),
      ...tasks.map(task => new Date(task.endDate)),
      ...filteredProjects.map(project => new Date(project.startDate)),
      ...filteredProjects.map(project => new Date(project.endDate))
    ];

    const start = new Date(Math.min(...allDates.map(d => d.getTime())));
    const end = new Date(Math.max(...allDates.map(d => d.getTime())));
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return {
      filteredTasks: tasks,
      dateRange: { start, end },
      totalDays: days
    };
  }, [filteredProjects]);

  const getTaskPosition = (startDate: string, endDate: string) => {
    const taskStart = new Date(startDate);
    const taskEnd = new Date(endDate);
    const startOffset = Math.max(0, (taskStart.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    };
  };

  const generateTimelineHeaders = () => {
    const headers = [];
    const currentDate = new Date(dateRange.start);
    
    while (currentDate <= dateRange.end) {
      headers.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return headers;
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gantt Chart</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No tasks available for selected projects
        </div>
      </div>
    );
  }

  const timelineHeaders = generateTimelineHeaders();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Gantt Chart</h3>
          <p className="text-sm text-gray-600">Task timeline and dependencies</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDate(dateRange.start.toISOString())} - {formatDate(dateRange.end.toISOString())}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Timeline Header */}
          <div className="flex border-b border-gray-200 mb-4">
            <div className="w-80 flex-shrink-0 p-3 font-medium text-gray-700 bg-gray-50">
              Task Details
            </div>
            <div className="flex-1 relative">
              <div className="flex h-12 bg-gray-50">
                {timelineHeaders.map((date) => (
                  <div
                    key={date.getTime()}
                    className="flex-1 min-w-24 p-2 text-xs font-medium text-gray-600 border-l border-gray-200 text-center"
                  >
                    {date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-1">
            {filteredTasks.map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              const position = getTaskPosition(task.startDate, task.endDate);
              
              return (
                <div key={task.id} className="flex items-center hover:bg-gray-50 rounded-lg">
                  {/* Task Info */}
                  <div className="w-80 flex-shrink-0 p-3 border-r border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {task.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {task.assignee}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            getPriorityColor(task.priority)
                          )}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {project?.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {task.progress}%
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative h-12 p-1">
                    <div className="relative h-full">
                      <div
                        className="absolute top-1 h-6 bg-blue-500 rounded-md opacity-80 flex items-center justify-center"
                        style={position}
                      >
                        {/* Progress Bar */}
                        <div
                          className="absolute left-0 top-0 h-full bg-green-500 rounded-l-md"
                          style={{ width: `${task.progress}%` }}
                        />
                        <span className="text-xs text-white font-medium z-10">
                          {task.progress > 20 ? `${task.progress}%` : ''}
                        </span>
                      </div>
                      
                      {/* Start and End Dates */}
                      <div className="absolute -bottom-1 left-0 text-xs text-gray-500">
                        {formatDate(task.startDate)}
                      </div>
                      <div className="absolute -bottom-1 right-0 text-xs text-gray-500">
                        {formatDate(task.endDate)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-3">Legend</h4>
            <div className="flex flex-wrap gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded opacity-80"></div>
                <span>Task Duration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Completed Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Progress %</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>Assignee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
