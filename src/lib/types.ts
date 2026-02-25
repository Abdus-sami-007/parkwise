
export type UserRole = 'owner' | 'guard' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
}

export interface ParkingLand {
  id: string;
  ownerId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  totalSlots: number;
  pricePerHour: number;
  image?: string;
}

export type SlotStatus = 'available' | 'booked' | 'occupied';

export interface ParkingSlot {
  id: string;
  landId: string;
  slotNumber: string;
  status: SlotStatus;
  currentVehicle?: string;
  bookedBy?: string;
  bookedUntil?: string;
  qrCode?: string;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  landId: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface GuardAssignment {
  id: string;
  guardId: string;
  landId: string;
  status: 'pending' | 'approved' | 'rejected';
}
