// types/land-registry.ts
export type Location = {
  id?: number;
  location: string;
  departments: string;
};

export type LandRegistry = {
  id: number;
  serial_no: number;
  county: string;
  station: string;
  locations: Location[];
};

export type CreateLandRegistryInput = {
  county: string;
  station: string;
  locations: Location[];
};

