"use client";

import { create } from 'zustand';
import { ParkingLand, ParkingSlot, Booking } from '@/lib/types';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  query, 
  where,
  getFirestore,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface ParkState {
  lands: ParkingLand[];
  slots: Record<string, ParkingSlot[]>;
  bookings: Booking[];
  loading: boolean;
  
  // Real-time Sync
  initSync: () => void;
  
  // Mutations
  updateSlotStatus: (landId: string, slotId: string, status: ParkingSlot['status'], vehicle?: string) => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
}

export const useParkStore = create<ParkState>((set, get) => ({
  lands: [],
  slots: {},
  bookings: [],
  loading: true,

  initSync: () => {
    const { db } = initializeFirebase();
    
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

    // Sync Bookings (global for simplicity in prototype)
    const bookingsQuery = collection(db, 'bookings');
    onSnapshot(bookingsQuery, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      set({ bookings });
    });
  },

  updateSlotStatus: async (landId, slotId, status, vehicle) => {
    const { db } = initializeFirebase();
    const slotRef = doc(db, 'parkingLands', landId, 'slots', slotId);
    
    await updateDoc(slotRef, {
      status,
      currentVehicle: vehicle || null,
      updatedAt: serverTimestamp()
    });
  },

  createBooking: async (bookingData) => {
    const { db } = initializeFirebase();
    
    // 1. Create Booking Record
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: serverTimestamp()
    });

    // 2. Update Slot Status
    const slotRef = doc(db, 'parkingLands', bookingData.landId, 'slots', bookingData.slotId);
    await updateDoc(slotRef, {
      status: 'booked',
      bookedBy: bookingData.userId,
      currentBookingId: bookingRef.id
    });
  },
}));
