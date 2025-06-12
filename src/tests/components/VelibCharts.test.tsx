import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import VelibUsageChart from '@/components/admin/dashboard/VelibUsageChart'
import VelibDistributionChart from '@/components/admin/dashboard/VelibDistributionChart'
import VelibAvailabilityChart from '@/components/admin/dashboard/VelibAvailabilityChart'

const mockConfig = {
  occupancy: { theme: { light: '#10b981' } },
  bikes: { theme: { light: '#3b82f6' } }
}

const mockUsageData = [
  { date: '2024-01-01', totalBikes: 100, totalDocks: 200, occupancyRate: 50 },
  { date: '2024-01-02', totalBikes: 120, totalDocks: 180, occupancyRate: 60 }
]

const mockDistributionData = [
  { arrondissement: '1er', stations: 25, bikes: 150, capacity: 300 },
  { arrondissement: '2ème', stations: 30, bikes: 180, capacity: 360 }
]

const mockAvailabilityData = [
  { hour: '00:00', bikes: 100, docks: 200, mechanical: 60, electric: 40 },
  { hour: '01:00', bikes: 120, docks: 180, mechanical: 70, electric: 50 }
]

describe('Velib Charts Components', () => {
  describe('VelibUsageChart', () => {
    it('should render usage chart with data', () => {
      render(
        <VelibUsageChart 
          data={mockUsageData} 
          config={mockConfig} 
        />
      )
      
      expect(screen.getByText('Évolution de l\'utilisation')).toBeInTheDocument()
      expect(screen.getByText('Taux d\'occupation des stations sur 7 jours')).toBeInTheDocument()
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    })

    it('should render empty chart when no data provided', () => {
      render(
        <VelibUsageChart 
          data={[]} 
          config={mockConfig} 
        />
      )
      
      expect(screen.getByText('Évolution de l\'utilisation')).toBeInTheDocument()
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    })
  })

  describe('VelibDistributionChart', () => {
    it('should render distribution chart with data', () => {
      render(
        <VelibDistributionChart 
          data={mockDistributionData} 
          config={mockConfig} 
        />
      )
      
      expect(screen.getByText('Répartition par arrondissement')).toBeInTheDocument()
      expect(screen.getByText('Nombre de stations par zone')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })
  })

  describe('VelibAvailabilityChart', () => {
    it('should render availability chart with data', () => {
      render(
        <VelibAvailabilityChart 
          data={mockAvailabilityData} 
          config={mockConfig} 
        />
      )
      
      expect(screen.getByText('Disponibilité des vélos par heure')).toBeInTheDocument()
      expect(screen.getByText('Évolution de la disponibilité sur les dernières 24h')).toBeInTheDocument()
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })
})
