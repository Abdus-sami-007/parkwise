
"use client";

import { create } from 'zustand';
import { UserProfile, ParkingLand, ParkingSlot, Booking } from '@/lib/types';
import { MOCK_LANDS, generateMockSlots } from '@/lib/mock-data';

interface ParkState {
  lands: ParkingLand[];
  slots: Record<string, ParkingSlot[]>;
  bookings: Booking[];
  loading: boolean;
  
  // Mutations (For prototype simulation)
  updateSlotStatus: (landId: string, slotId: string, status: ParkingSlot['status'], vehicle?: string) => void;
  createBooking: (booking: Omit<Booking, 'id'>) => void;
  setLands: (lands: ParkingLand[]) => void;
  setBookings: (bookings: Booking[]) => void;
}

export const useParkStore = create<ParkState>((set) => ({
  lands: MOCK_LANDS,
  slots: {
    'land1': generateMockSlots('land1', 50),
    'land2': generateMockSlots('land2', 30),
  },
  bookings: [],
  loading: false,

  setLands: (lands) => set({ lands }),
  setBookings: (bookings) => set({ bookings }),

  updateSlotStatus: (landId, slotId, status, vehicle) => set((state) => ({
    slots: {
      ...state.slots,
      [landId]: (state.slots[landId] || []).map(slot => 
        slot.id === slotId ? { ...slot, status, currentVehicle: vehicle } : slot
      )
    }
  })),

  createBooking: (bookingData) => set((state) => {
    const newBooking: Booking = { ...bookingData, id: `booking-${Date.now()}` };
    const updatedSlots = { ...state.slots };
    
    if (updatedSlots[bookingData.landId]) {
      updatedSlots[bookingData.landId] = updatedSlots[bookingData.landId].map(slot =>
        slot.id === bookingData.slotId ? { ...slot, status: 'booked', bookedBy: bookingData.userId } : slot
      );
    }

    return {
      bookings: [...state.bookings, newBooking],
      slots: updatedSlots
    };
  }),
}));
