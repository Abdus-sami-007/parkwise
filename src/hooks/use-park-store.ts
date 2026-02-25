
"use client";

import { create } from 'zustand';
import { UserProfile, ParkingLand, ParkingSlot, Booking, UserRole } from '@/lib/types';
import { MOCK_USERS, MOCK_LANDS, generateMockSlots } from '@/lib/mock-data';

interface ParkState {
  currentUser: UserProfile | null;
  lands: ParkingLand[];
  slots: Record<string, ParkingSlot[]>; // landId -> slots
  bookings: Booking[];
  loading: boolean;
  
  // Auth
  login: (role: UserRole) => void;
  logout: () => void;
  
  // Mutations
  updateSlotStatus: (landId: string, slotId: string, status: ParkingSlot['status'], vehicle?: string) => void;
  createBooking: (booking: Omit<Booking, 'id'>) => void;
}

export const useParkStore = create<ParkState>((set) => ({
  currentUser: null,
  lands: MOCK_LANDS,
  slots: {
    'land1': generateMockSlots('land1', 50),
    'land2': generateMockSlots('land2', 30),
  },
  bookings: [],
  loading: false,

  login: (role) => {
    const user = MOCK_USERS.find(u => u.role === role) || null;
    set({ currentUser: user });
  },

  logout: () => set({ currentUser: null }),

  updateSlotStatus: (landId, slotId, status, vehicle) => set((state) => ({
    slots: {
      ...state.slots,
      [landId]: state.slots[landId].map(slot => 
        slot.id === slotId ? { ...slot, status, currentVehicle: vehicle } : slot
      )
    }
  })),

  createBooking: (bookingData) => set((state) => {
    const newBooking: Booking = { ...bookingData, id: `booking-${Date.now()}` };
    const updatedSlots = { ...state.slots };
    
    // Update slot status to booked if booking confirmed
    updatedSlots[bookingData.landId] = updatedSlots[bookingData.landId].map(slot =>
      slot.id === bookingData.slotId ? { ...slot, status: 'booked', bookedBy: bookingData.userId } : slot
    );

    return {
      bookings: [...state.bookings, newBooking],
      slots: updatedSlots
    };
  }),
}));
