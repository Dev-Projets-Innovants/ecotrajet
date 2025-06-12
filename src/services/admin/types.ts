
export interface VelibDashboardStats {
  totalStations: number;
  activeStations: number;
  totalBikesAvailable: number;
  totalDocksAvailable: number;
  mechanicalBikes: number;
  electricBikes: number;
  averageCapacity: number;
  lastUpdated: string;
}

export interface VelibAvailabilityTrend {
  hour: string;
  bikes: number;
  docks: number;
  mechanical: number;
  electric: number;
}

export interface VelibDistributionData {
  arrondissement: string;
  stations: number;
  bikes: number;
  capacity: number;
}

export interface VelibUsageData {
  date: string;
  totalBikes: number;
  totalDocks: number;
  occupancyRate: number;
}
