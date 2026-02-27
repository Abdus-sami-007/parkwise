
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
  isInitialized: boolean;
  
  // Local Actions
  login: (role: string) => void;
  updateSlotStatus: (landId: string, slotId: string, status: ParkingSlot['status'], vehicle?: string) => void;
  createBooking: (booking: Omit<Booking, 'id'>) => void;
  addParkingLand: (landData: { name: string, totalSlots: number, pricePerHour: number }) => void;
  initLocalData: () => void;
}

export const useParkStore = create<ParkState>((set, get) => ({
  lands: [],
  slots: {},
  bookings: [],
  availableGuards: [],
  currentUser: null,
  loading: true,
  isInitialized: false,

  initLocalData: () => {
    if (get().isInitialized) return;

    const initialSlots: Record<string, ParkingSlot[]> = {};
    MOCK_LANDS.forEach(land => {
      initialSlots[land.id] = generateMockSlots(land.id, land.totalSlots);
    });

    set({ 
      lands: MOCK_LANDS, 
      slots: initialSlots, 
      availableGuards: MOCK_USERS.filter(u => u.role === 'guard'),
      loading: false, 
      isInitialized: true 
    });
  },

  login: (role) => {
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
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
