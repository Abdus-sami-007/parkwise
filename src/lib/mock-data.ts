
import { ParkingLand, ParkingSlot, UserProfile } from './types';

export const MOCK_USERS: UserProfile[] = [
  { uid: 'owner1', email: 'owner@parkwise.com', displayName: 'Land Owner', role: 'owner' },
  { uid: 'guard1', email: 'guard@parkwise.com', displayName: 'Security Guard', role: 'guard' },
  { uid: 'user1', email: 'user@parkwise.com', displayName: 'John Doe', role: 'customer' },
];

export const MOCK_LANDS: ParkingLand[] = [
  {
    id: 'land1',
    ownerId: 'owner1',
    name: 'Hyderabad Central Mall Parking',
    location: { lat: 17.3850, lng: 78.4867 },
    totalSlots: 50,
    pricePerHour: 20,
    image: 'https://picsum.photos/seed/parking1/600/400',
  },
  {
    id: 'land2',
    ownerId: 'owner1',
    name: 'Hitech City Corporate Parking',
    location: { lat: 17.4400, lng: 78.3800 },
    totalSlots: 30,
    pricePerHour: 30,
    image: 'https://picsum.photos/seed/parking2/600/400',
  },
];

export const generateMockSlots = (landId: string, count: number): ParkingSlot[] => {
  const statuses: ('available' | 'booked' | 'occupied')[] = ['available', 'available', 'available', 'booked', 'occupied'];
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `${landId}-slot-${i + 1}`,
      landId,
      slotNumber: String.fromCharCode(65 + Math.floor(i / 10)) + (i % 10 + 1),
      status,
      currentVehicle: status === 'occupied' ? `TS-0${Math.floor(Math.random() * 9)}B-${1000 + Math.floor(Math.random() * 8999)}` : undefined,
    };
  });
};
