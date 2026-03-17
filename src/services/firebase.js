import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { app } from '../firebase'

const db = getFirestore(app)
const BOOKINGS_COLLECTION = 'bookings'
const SETTINGS_COLLECTION = 'appConfig'
const SETTINGS_DOC = 'settings'

export async function addBooking(bookingData) {
  const payload = {
    ...bookingData,
    createdAt: bookingData.createdAt || new Date().toISOString(),
  }

  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), payload)
  return docRef.id
}

export async function getBookings() {
  const bookingsQuery = query(
    collection(db, BOOKINGS_COLLECTION),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(bookingsQuery)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function getAppSettings() {
  const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC)
  const snapshot = await getDoc(settingsRef)

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data()
}

export async function saveAppSettings(settingsData) {
  const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC)
  const payload = {
    ...settingsData,
    updatedAt: new Date().toISOString(),
  }

  await setDoc(settingsRef, payload, { merge: true })
}

export { db }
