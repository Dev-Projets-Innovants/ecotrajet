import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { useOptimizedVelibData } from '@/hooks/useOptimizedVelibData'

// Mock du service
vi.mock('@/services/admin', () => ({
  getVelibDashboardStats: vi.fn().mockResolvedValue({
    totalStations: 1500,
    activeStations: 1450,
    totalBikesAvailable: 8500,
    totalDocksAvailable: 12000,
    mechanicalBikes: 6000,
    electricBikes: 2500,
    averageCapacity: 25,
    lastUpdated: new Date().toISOString()
  }),
  getVelibAvailabilityTrends: vi.fn().mockResolvedValue([]),
  getVelibDistributionData: vi.fn().mockResolvedValue([]),
  getVelibUsageData: vi.fn().mockResolvedValue([])
}))

describe('useOptimizedVelibData', () => {
  it('should return initial loading state', () => {
    const { result } = renderHook(() => useOptimizedVelibData(false))
    
    expect(result.current.isLoading).toBe(true)
    expect(result.current.stats).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should load data successfully', async () => {
    const { result } = renderHook(() => useOptimizedVelibData(false))
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.stats).toBeDefined()
    expect(result.current.chartConfig).toBeDefined()
  })

  it('should provide refetch function', () => {
    const { result } = renderHook(() => useOptimizedVelibData(false))
    
    expect(typeof result.current.refetchData).toBe('function')
  })
})
