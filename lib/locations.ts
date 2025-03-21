// Location interface
export interface Location {
  id: string;
  name: string;
}

// Available locations data
export const locations: Location[] = [
  { id: "toronto", name: "Toronto" },
  { id: "mississauga", name: "Mississauga" },
  { id: "hamilton", name: "Hamilton" },
  { id: "vaughan", name: "Vaughan" },
  { id: "markham", name: "Markham" },
  { id: "richmond-hill", name: "Richmond Hill" },
  { id: "oakville", name: "Oakville" },
  { id: "burlington", name: "Burlington" },
  { id: "oshawa", name: "Oshawa" },
  { id: "brampton", name: "Brampton" }
];

// Helper function to find a location by ID
export function findLocationById(locationId: string): Location | undefined {
  return locations.find(location => location.id === locationId);
}

// Get default location
export function getDefaultLocation(): Location {
  return locations[0]; // Toronto
} 