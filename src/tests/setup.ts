
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock pour react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ children }: { children: React.ReactNode }) => children,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => 
    React.createElement('a', { href: to }, children),
}))

// Mock pour @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock pour les hooks personnalisés
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
  toast: vi.fn(),
}))

// Mock pour Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  AreaChart: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', { 'data-testid': 'area-chart' }, children),
  BarChart: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', { 'data-testid': 'bar-chart' }, children),
  LineChart: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', { 'data-testid': 'line-chart' }, children),
  Area: () => React.createElement('div', { 'data-testid': 'area' }),
  Bar: () => React.createElement('div', { 'data-testid': 'bar' }),
  Line: () => React.createElement('div', { 'data-testid': 'line' }),
  XAxis: () => React.createElement('div', { 'data-testid': 'x-axis' }),
  YAxis: () => React.createElement('div', { 'data-testid': 'y-axis' }),
  CartesianGrid: () => React.createElement('div', { 'data-testid': 'cartesian-grid' }),
  Legend: () => React.createElement('div', { 'data-testid': 'legend' }),
  Cell: () => React.createElement('div', { 'data-testid': 'cell' }),
}))
