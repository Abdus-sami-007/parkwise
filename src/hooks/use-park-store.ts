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
  logout: () => void;
  updateSlotStatus: (landId: string, slotId: string, status: ParkingSlot['status'], vehicle?: string) => void;
  createBooking: (bookingData: Omit<Booking, 'id'>) => void;
  addParkingLand: (db: any, ownerId: string, landData: { name: string, totalSlots: number, pricePerHour: number }) => void;
  recruitGuard: (guardId: string) => void;
  seedSampleData: () => void;
}

// Ensure unique IDs and clear initial state
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
    set({ lands: MOCK_LANDS, slots: freshSlots, bookings: [] });
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

  logout: () => set({ currentUser: null }),

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

  addParkingLand: (db, ownerId, landData) => {
    const id = `land-${Math.random().toString(36).substr(2, 9)}`;
    const newLand: ParkingLand = {
      id,
      ownerId: ownerId || 'anonymous',
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
  },

  recruitGuard: (guardId) => {
    set(state => ({
      availableGuards: state.availableGuards.map(g => 
        g.uid === guardId ? { ...g, recruited: true } : g
      )
    }));
  }
}));
