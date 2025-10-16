# PMO Dashboard - Interactive Project Management Analytics

A comprehensive **Project Management Office (PMO) Dashboard** built with **Next.js**, **TypeScript**, and **Tailwind CSS**. This dashboard provides real-time analytics, interactive filtering, and advanced data visualizations similar to **Tableau** and **Looker** for enterprise project management.

![PMO Dashboard](https://img.shields.io/badge/PMO-Dashboard-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 🚀 Features

### 📊 Interactive Analytics
- **Real-time KPI Cards** - Total projects, active projects, completion rates, budget variance
- **S-Curve Analysis** - Progress and cost tracking over time with planned vs actual comparisons
- **Gantt Chart** - Task timeline visualization with dependencies and progress tracking
- **FEL Pipeline** - Front End Loading stages (FEL 1, FEL 2, FEL 3, Execute, Operate) analysis
- **Funnel Chart** - Project lifecycle stage distribution and conversion rates
- **Resource Utilization** - Department capacity and allocation visualization
- **Budget Analysis** - Spending by category with pie charts and variance tracking

### 🎛️ Advanced Filtering System
- **Clickable Filters** - Direct dashboard interaction like Tableau/Looker
- **Multi-dimensional Filtering** - Status, FEL Stage, Department, Priority, Category
- **Quick Filters** - Preset filters for Active, Critical, At-Risk, and Completed projects
- **Search Functionality** - Global search across projects, managers, and departments
- **Date Range Filtering** - Project timeline-based filtering
- **Real-time Updates** - All charts update instantly when filters are applied

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Professional Styling** - Clean, modern interface with consistent design patterns
- **Interactive Components** - Hover effects, tooltips, and smooth animations
- **Accessibility** - WCAG compliant with proper color contrast and keyboard navigation
- **Dark Mode Ready** - Theme-aware components and styling

## 🏗️ Architecture

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icon set
- **Framer Motion** - Animation library

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── DashboardFilters.tsx    # Interactive filter system
│   ├── KPICards.tsx           # Key Performance Indicator cards
│   ├── SCurveChart.tsx        # S-Curve progress analysis
│   ├── GanttChart.tsx         # Gantt timeline visualization
│   ├── FELPipeline.tsx        # FEL stages pipeline
│   ├── FunnelChart.tsx        # Project funnel analysis
│   └── ResourceAndBudgetCharts.tsx # Resource and budget charts
├── contexts/              # React Context providers
│   └── FilterContext.tsx     # Global filter state management
├── data/                  # Sample data and interfaces
│   └── sampleData.ts         # Complex project management data
└── lib/                   # Utility functions
    └── utils.ts              # Helper functions and utilities
```

## 📊 Dashboard Components

### 1. KPI Cards
- **Total Projects** - Overview of all projects in the system
- **Active Projects** - Currently ongoing projects
- **Completed Projects** - Successfully finished projects
- **Average Completion** - Overall progress percentage
- **Total Budget** - Aggregated project budgets
- **Budget Variance** - Over/under budget analysis
- **Critical Projects** - High-priority project count
- **Resource Utilization** - Team capacity metrics

### 2. FEL Pipeline Analysis
- **FEL Stage Distribution** - Projects across Front End Loading stages
- **Stage Metrics** - Budget, progress, and risk analysis per stage
- **Pipeline Flow** - Visual representation of project progression
- **Critical Path** - Identification of bottlenecks and risks

### 3. Funnel Chart
- **Lifecycle Stages** - Planning, Active, Completed, On Hold
- **Conversion Rates** - Stage-to-stage project progression
- **Pipeline Value** - Budget distribution across stages
- **Success Metrics** - Completion and conversion analytics

### 4. S-Curve Analysis
- **Progress Tracking** - Planned vs actual progress over time
- **Cost Analysis** - Budget spend patterns and forecasting
- **Variance Analysis** - Early warning indicators
- **Performance Trends** - Historical data patterns

### 5. Gantt Chart
- **Task Timeline** - Visual project schedules
- **Dependencies** - Task relationships and critical path
- **Resource Assignment** - Team member allocations
- **Progress Indicators** - Real-time completion status

### 6. Resource & Budget Charts
- **Department Utilization** - Capacity vs allocation by team
- **Budget Breakdown** - Spending by project category
- **Resource Planning** - Optimization opportunities
- **Cost Control** - Variance tracking and alerts

## 🎛️ Interactive Filtering

### Filter Categories
- **Project Status** - Planning, Active, On Hold, Completed, Cancelled
- **FEL Stages** - FEL 1, FEL 2, FEL 3, Execute, Operate
- **Departments** - IT, Engineering, Operations, R&D, Supply Chain
- **Priority Levels** - Low, Medium, High, Critical
- **Project Categories** - Infrastructure, Digital, Manufacturing, R&D, Operations

### Quick Filters
- **Active Projects** - Currently running projects
- **Critical Priority** - High-priority items requiring attention
- **At Risk** - Projects with potential issues
- **Completed** - Successfully finished projects

### Search & Date Filtering
- **Global Search** - Find projects by name, manager, or department
- **Date Range** - Filter by project start/end dates
- **Real-time Updates** - Instant chart updates on filter changes

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0 or higher
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard-clickable-filter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📈 Sample Data Structure

The dashboard includes comprehensive sample data representing real-world project management scenarios:

### Projects
- 6 sample projects across different categories and stages
- Realistic budgets, timelines, and completion percentages
- Assigned project managers and departments
- Risk assessments and priority levels

### S-Curve Data
- Historical progress and cost data points
- Planned vs actual comparisons
- Multiple projects with different timeline patterns

### Gantt Tasks
- Task breakdown for major projects
- Dependencies and critical path information
- Resource assignments and progress tracking

### KPIs & Metrics
- Calculated performance indicators
- Resource utilization data
- Budget analysis by category
- Risk assessment matrices

## 🎨 Customization

### Adding New Charts
1. Create a new component in `src/components/`
2. Import data from `src/data/sampleData.ts`
3. Use the filter context: `const { filteredProjects } = useFilter()`
4. Add the component to `src/app/page.tsx`

### Custom Filters
Extend the filter system by:
1. Adding new filter types to `FilterContext.tsx`
2. Updating the `FilterState` interface
3. Adding UI controls in `DashboardFilters.tsx`

### Data Integration
Replace sample data with real data by:
1. Updating interfaces in `src/data/sampleData.ts`
2. Creating API integration functions
3. Implementing data fetching in components

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile** - < 768px (stacked layout)
- **Tablet** - 768px - 1024px (2-column grid)
- **Desktop** - > 1024px (full grid layout)

## 🛠️ Development

### Code Standards
- **ESLint** - Code linting with Next.js rules
- **TypeScript** - Strict type checking
- **Tailwind CSS** - Utility-first styling

### Production Build
```bash
npm run build
npm start
```

## 🔧 Troubleshooting

### Common Issues

**Build Errors**
- Ensure Node.js version compatibility
- Clear node_modules and reinstall dependencies
- Check TypeScript errors with `npm run type-check`

**Chart Rendering Issues**
- Verify data format matches component expectations
- Check browser console for JavaScript errors
- Ensure responsive container dimensions

**Filter Not Working**
- Verify FilterProvider wraps the application
- Check filter state updates in React DevTools
- Ensure proper useFilter hook usage

**Hydration Errors**
- Dynamic content (timestamps, random values) should use client-side only components
- Use the `useIsClient` hook for hydration-safe operations
- Add `suppressHydrationWarning` for unavoidable hydration differences
- Ensure consistent data between server and client rendering

## 📈 Future Enhancements

### Planned Features
- **Real-time Data** - WebSocket integration for live updates
- **Advanced Analytics** - Machine learning insights and predictions
- **Custom Dashboards** - User-configurable dashboard layouts
- **Export Functionality** - PDF/Excel report generation
- **User Management** - Role-based access control

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions:
- **GitHub Issues** - Bug reports and feature requests
- **Documentation** - Comprehensive guides and examples

---

**Built with ❤️ for modern project management teams**
