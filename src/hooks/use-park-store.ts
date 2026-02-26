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
  Firestore,
  query,
  limit
} from 'firebase/firestore';

interface ParkState {
  lands: ParkingLand[];
  slots: Record<string, ParkingSlot[]>;
  bookings: Booking[];
  loading: boolean;
  isInitialized: boolean;
  
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
  isInitialized: false,

  initSync: (db) => {
    if (get().isInitialized) return;

    // Sync Lands with a limit for faster initial load
    const landsQuery = query(collection(db, 'parkingLands'), limit(20));
    
    const unsubLands = onSnapshot(landsQuery, { includeMetadataChanges: true }, (snapshot) => {
      const lands = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParkingLand));
      set({ lands, loading: false, isInitialized: true });

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
    }, (error) => {
      console.error("Firestore Lands Sync Error:", error);
    });

    // Sync Bookings
    const bookingsQuery = query(collection(db, 'bookings'), limit(50));
    const unsubBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      set({ bookings });
    }, (error) => {
      console.error("Firestore Bookings Sync Error:", error);
    });
  },

  updateSlotStatus: async (db, landId, slotId, status, vehicle) => {
    const slotRef = doc(db, 'parkingLands', landId, 'slots', slotId);
    // Optimistic background update
    updateDoc(slotRef, {
      status,
      currentVehicle: vehicle || null,
      updatedAt: serverTimestamp()
    }).catch(e => console.error("Slot status update failed", e));
  },

  createBooking: async (db, bookingData) => {
    try {
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
    } catch (e) {
      console.error("Booking creation failed", e);
      throw e;
    }
  },
}));
