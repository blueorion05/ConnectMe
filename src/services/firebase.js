import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { app } from '../firebase'

const db = getFirestore(app)
const BOOKINGS_COLLECTION = 'bookings'

export async function addBooking(bookingData) {
  const payload = {
    ...bookingData,
    createdAt: bookingData.createdAt || new Date().toISOString(),
  }

  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), payload)
  return docRef.id
}

export { db }
