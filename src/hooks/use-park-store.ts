
"use client";

import { create } from 'zustand';
import { ParkingLand, ParkingSlot, Booking, UserProfile } from '@/lib/types';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  Firestore,
  query,
  limit,
  where
} from 'firebase/firestore';

interface ParkState {
  lands: ParkingLand[];
  slots: Record<string, ParkingSlot[]>;
  bookings: Booking[];
  availableGuards: UserProfile[];
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
  availableGuards: [],
  loading: true,
  isInitialized: false,

  initSync: (db) => {
    if (get().isInitialized) return;

    // Sync Lands
    const landsQuery = query(collection(db, 'parkingLands'), limit(20));
    onSnapshot(landsQuery, (snapshot) => {
      const lands = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParkingLand));
      set({ lands, loading: false, isInitialized: true });

      // Sync slots for each land
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
    const bookingsQuery = query(collection(db, 'bookings'), limit(50));
    onSnapshot(bookingsQuery, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      set({ bookings });
    });

    // Sync Available Guards (All users with role 'guard')
    const guardsQuery = query(collection(db, 'users'), where('role', '==', 'guard'), limit(50));
    onSnapshot(guardsQuery, (snapshot) => {
      const guards = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
      set({ availableGuards: guards });
    });
  },

  updateSlotStatus: async (db, landId, slotId, status, vehicle) => {
    const slotRef = doc(db, 'parkingLands', landId, 'slots', slotId);
    updateDoc(slotRef, {
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
    updateDoc(slotRef, {
      status: 'booked',
      bookedBy: bookingData.userId,
      currentBookingId: bookingRef.id
    });
  },
}));
