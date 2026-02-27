
"use client";

import { create } from 'zustand';
import { ParkingLand, ParkingSlot, Booking, UserProfile } from '@/lib/types';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  setDoc,
  serverTimestamp,
  Firestore,
  query,
  limit,
  where,
  getDocs
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

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
  updateSlotStatus: (db: Firestore, landId: string, slotId: string, status: ParkingSlot['status'], vehicle?: string) => void;
  createBooking: (db: Firestore, booking: Omit<Booking, 'id'>) => void;
  addParkingLand: (db: Firestore, ownerId: string, landData: { name: string, totalSlots: number, pricePerHour: number }) => void;
  seedSampleData: (db: Firestore) => void;
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
    }, (error) => {
       const permissionError = new FirestorePermissionError({
          path: 'parkingLands',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
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

  updateSlotStatus: (db, landId, slotId, status, vehicle) => {
    const slotRef = doc(db, 'parkingLands', landId, 'slots', slotId);
    const data = {
      status,
      currentVehicle: vehicle || null,
      updatedAt: serverTimestamp()
    };

    updateDoc(slotRef, data).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: slotRef.path,
        operation: 'update',
        requestResourceData: data,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  },

  createBooking: (db, bookingData) => {
    const bookingRef = doc(collection(db, 'bookings'));
    const slotRef = doc(db, 'parkingLands', bookingData.landId, 'slots', bookingData.slotId);
    
    const bookingDoc = {
      ...bookingData,
      id: bookingRef.id,
      createdAt: serverTimestamp()
    };

    const slotUpdate = {
      status: 'booked',
      bookedBy: bookingData.userId,
      currentBookingId: bookingRef.id
    };

    setDoc(bookingRef, bookingDoc).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: bookingRef.path,
        operation: 'create',
        requestResourceData: bookingDoc,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });

    updateDoc(slotRef, slotUpdate).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: slotRef.path,
        operation: 'update',
        requestResourceData: slotUpdate,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  },

  addParkingLand: (db, ownerId, landData) => {
    const landRef = doc(collection(db, 'parkingLands'));
    const landDoc = {
      id: landRef.id,
      ownerId: ownerId,
      name: landData.name,
      totalSlots: landData.totalSlots,
      pricePerHour: landData.pricePerHour,
      location: { lat: 17.3850, lng: 78.4867 }, // Default Hyderabad
      image: `https://picsum.photos/seed/${landRef.id}/600/400`,
      createdAt: serverTimestamp()
    };

    setDoc(landRef, landDoc).catch(async () => {
      const permissionError = new FirestorePermissionError({
        path: landRef.path,
        operation: 'create',
        requestResourceData: landDoc,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });

    // Initialize slots
    for (let i = 0; i < landData.totalSlots; i++) {
      const slotId = `slot-${i + 1}`;
      const slotRef = doc(db, 'parkingLands', landRef.id, 'slots', slotId);
      const slotData = {
        id: slotId,
        landId: landRef.id,
        slotNumber: String.fromCharCode(65 + Math.floor(i / 10)) + (i % 10 + 1),
        status: 'available'
      };
      setDoc(slotRef, slotData);
    }
  },

  seedSampleData: async (db) => {
    // Seed some guards if none exist
    const guardsSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'guard'), limit(1)));
    if (guardsSnapshot.empty) {
      const sampleGuards = [
        { uid: 'guard_1', displayName: 'Vikram Singh', email: 'vikram@guards.com', role: 'guard', phone: '+91 98765 43210' },
        { uid: 'guard_2', displayName: 'Anjali Sharma', email: 'anjali@guards.com', role: 'guard', phone: '+91 87654 32109' },
        { uid: 'guard_3', displayName: 'Rahul Verma', email: 'rahul@guards.com', role: 'guard', phone: '+91 76543 21098' },
      ];
      sampleGuards.forEach(g => setDoc(doc(db, 'users', g.uid), g));
    }

    // Seed a sample land if none exist
    const landsSnapshot = await getDocs(query(collection(db, 'parkingLands'), limit(1)));
    if (landsSnapshot.empty) {
      get().addParkingLand(db, 'demo_owner', {
        name: 'Hyderabad Central Mall',
        totalSlots: 40,
        pricePerHour: 50
      });
      get().addParkingLand(db, 'demo_owner', {
        name: 'Hitech City Square',
        totalSlots: 20,
        pricePerHour: 40
      });
    }
  }
}));
