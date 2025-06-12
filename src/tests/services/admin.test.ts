
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  getVelibDashboardStats, 
  getVelibAvailabilityTrends, 
  getVelibDistributionData,
  getVelibUsageData 
} from '@/services/admin'

// Mock des données de test
const mockStats = {
  totalStations: 1500,
  activeStations: 1450,
  totalBikesAvailable: 8500,
  totalDocksAvailable: 12000,
  mechanicalBikes: 6000,
  electricBikes: 2500,
  averageCapacity: 25,
  lastUpdated: new Date().toISOString()
}

const mockAvailabilityTrends = [
  { hour: '00:00', bikes: 100, docks: 200, mechanical: 60, electric: 40 },
  { hour: '01:00', bikes: 120, docks: 180, mechanical: 70, electric: 50 }
]

describe('Admin Services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getVelibDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      const stats = await getVelibDashboardStats()
      
      expect(stats).toBeDefined()
      expect(typeof stats.totalStations).toBe('number')
      expect(typeof stats.activeStations).toBe('number')
      expect(typeof stats.totalBikesAvailable).toBe('number')
      expect(typeof stats.lastUpdated).toBe('string')
    })
  })

  describe('getVelibAvailabilityTrends', () => {
    it('should return availability trends data', async () => {
      const trends = await getVelibAvailabilityTrends()
      
      expect(Array.isArray(trends)).toBe(true)
      if (trends.length > 0) {
        expect(trends[0]).toHaveProperty('hour')
        expect(trends[0]).toHaveProperty('bikes')
        expect(trends[0]).toHaveProperty('docks')
      }
    })
  })

  describe('getVelibDistributionData', () => {
    it('should return distribution data', async () => {
      const distribution = await getVelibDistributionData()
      
      expect(Array.isArray(distribution)).toBe(true)
      if (distribution.length > 0) {
        expect(distribution[0]).toHaveProperty('arrondissement')
        expect(distribution[0]).toHaveProperty('stations')
      }
    })
  })

  describe('getVelibUsageData', () => {
    it('should return usage data', async () => {
      const usage = await getVelibUsageData()
      
      expect(Array.isArray(usage)).toBe(true)
      if (usage.length > 0) {
        expect(usage[0]).toHaveProperty('date')
        expect(usage[0]).toHaveProperty('occupancyRate')
      }
    })
  })
})
