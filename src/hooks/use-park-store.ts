
"use client";

import { create } from 'zustand';
import { ParkingLand, ParkingSlot, Booking, UserProfile } from '@/lib/types';
import { MOCK_LANDS, MOCK_USERS, generateMockSlots } from '@/lib/mock-data';

interface ParkState {
  lands: ParkingLand[];
  slots: Record<string, ParkingSlot[]>;
  bookings: Booking[];
  availableGuards: UserProfile[];
  currentUser: UserProfile | null;
  loading: boolean;
  
  // Actions
  login: (role: string, email?: string, name?: string) => void;
  updateSlotStatus: (landId: string, slotId: string, status: ParkingSlot['status'], vehicle?: string) => void;
  createBooking: (bookingData: Omit<Booking, 'id'>) => void;
  addParkingLand: (landData: { name: string, totalSlots: number, pricePerHour: number }) => void;
  seedSampleData: () => void;
}

// Pre-initialize data for instant loading
const initialSlots: Record<string, ParkingSlot[]> = {};
MOCK_LANDS.forEach(land => {
  initialSlots[land.id] = generateMockSlots(land.id, land.totalSlots);
});

export const useParkStore = create<ParkState>((set, get) => ({
  lands: MOCK_LANDS,
  slots: initialSlots,
  bookings: [],
  availableGuards: MOCK_USERS.filter(u => u.role === 'guard'),
  currentUser: null,
  loading: false,

  seedSampleData: () => {
    const freshSlots: Record<string, ParkingSlot[]> = {};
    MOCK_LANDS.forEach(land => {
      freshSlots[land.id] = generateMockSlots(land.id, land.totalSlots);
    });
    set({ lands: MOCK_LANDS, slots: freshSlots });
  },

  login: (role, email, name) => {
    const user: UserProfile = {
      uid: `user-${Math.random().toString(36).substr(2, 9)}`,
      email: email || `${role}@example.com`,
      displayName: name || (role.charAt(0).toUpperCase() + role.slice(1)),
      role: role as any,
    };
    set({ currentUser: user });
  },

  updateSlotStatus: (landId, slotId, status, vehicle) => {
    set(state => {
      const landSlots = [...(state.slots[landId] || [])];
      const slotIndex = landSlots.findIndex(s => s.id === slotId);
      if (slotIndex > -1) {
        landSlots[slotIndex] = {
          ...landSlots[slotIndex],
          status,
          currentVehicle: vehicle || undefined
        };
      }
      return { slots: { ...state.slots, [landId]: landSlots } };
    });
  },

  createBooking: (bookingData) => {
    const id = `booking-${Math.random().toString(36).substr(2, 9)}`;
    const newBooking: Booking = {
      ...bookingData,
      id,
    };

    set(state => ({
      bookings: [newBooking, ...state.bookings]
    }));

    get().updateSlotStatus(bookingData.landId, bookingData.slotId, 'booked');
  },

  addParkingLand: (landData) => {
    const id = `land-${Math.random().toString(36).substr(2, 9)}`;
    const newLand: ParkingLand = {
      id,
      ownerId: get().currentUser?.uid || 'anonymous',
      name: landData.name,
      location: { lat: 17.3850, lng: 78.4867 },
      totalSlots: landData.totalSlots,
      pricePerHour: landData.pricePerHour,
      image: `https://picsum.photos/seed/${id}/600/400`,
    };

    const newSlots = generateMockSlots(id, landData.totalSlots);

    set(state => ({
      lands: [...state.lands, newLand],
      slots: { ...state.slots, [id]: newSlots }
    }));
  }
}));
