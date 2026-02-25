"use client";

import { create } from 'zustand';
import { ParkingLand, ParkingSlot, Booking } from '@/lib/types';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  Firestore
} from 'firebase/firestore';

interface ParkState {
  lands: ParkingLand[];
  slots: Record<string, ParkingSlot[]>;
  bookings: Booking[];
  loading: boolean;
  
  // Real-time Sync
  initSync: (db: Firestore) => void;
  
  // Mutations
  updateSlotStatus: (db: Firestore, landId: string, slotId: string, status: ParkingSlot['status'], vehicle?: string) => Promise<void>;
  createBooking: (db: Firestore, booking: Omit<Booking, 'id'>) => Promise<void>;
}

export const useParkStore = create<ParkState>((set, get) => ({
  lands: [],
  slots: {},
  bookings: [],
  loading: true,

  initSync: (db) => {
    // Sync Lands
    const landsQuery = collection(db, 'parkingLands');
    onSnapshot(landsQuery, (snapshot) => {
      const lands = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParkingLand));
      set({ lands, loading: false });

      // For each land, sync its slots
      lands.forEach(land => {
        const slotsQuery = collection(db, 'parkingLands', land.id, 'slots');
        onSnapshot(slotsQuery, (slotSnap) => {
          const landSlots = slotSnap.docs.map(d => ({ id: d.id, ...d.data() } as ParkingSlot));
          set(state => ({
            slots: { ...state.slots, [land.id]: landSlots }
          }));
        });
      });
    });

    // Sync Bookings
    const bookingsQuery = collection(db, 'bookings');
    onSnapshot(bookingsQuery, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      set({ bookings });
    });
  },

  updateSlotStatus: async (db, landId, slotId, status, vehicle) => {
    const slotRef = doc(db, 'parkingLands', landId, 'slots', slotId);
    await updateDoc(slotRef, {
      status,
      currentVehicle: vehicle || null,
      updatedAt: serverTimestamp()
    });
  },

  createBooking: async (db, bookingData) => {
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: serverTimestamp()
    });

    const slotRef = doc(db, 'parkingLands', bookingData.landId, 'slots', bookingData.slotId);
    await updateDoc(slotRef, {
      status: 'booked',
      bookedBy: bookingData.userId,
      currentBookingId: bookingRef.id
    });
  },
}));
