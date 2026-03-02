// Simple script to upload db.json to Firestore using client SDK
// No service account key needed!

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Your Firebase config (from .env)
const firebaseConfig = {
  apiKey: "AIzaSyBJfWbGgZ6sWR9THykNck4pk-LGC3LZamI",
  authDomain: "hotel-booking-16f5a.firebaseapp.com",
  projectId: "hotel-booking-16f5a",
  storageBucket: "hotel-booking-16f5a.firebasestorage.app",
  messagingSenderId: "719219563016",
  appId: "1:719219563016:web:a344c47688dd4b61cfcfbd",
  measurementId: "G-B641MT9Z3B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Read db.json
const dbJsonPath = path.join(__dirname, 'server/db.json');
const data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

async function uploadHotels() {
  const hotels = data.hotels;
  console.log(`Starting upload of ${hotels.length} hotels...`);
  
  let completed = 0;
  for (const hotel of hotels) {
    try {
      const docRef = doc(db, 'hotels', String(hotel.id));
      await setDoc(docRef, hotel);
      completed++;
      if (completed % 10 === 0) {
        console.log(`✓ Uploaded ${completed}/${hotels.length} hotels`);
      }
    } catch (error) {
      console.error(`Error uploading hotel ${hotel.id}:`, error.message);
    }
  }
  
  console.log(`\n✅ Done! Uploaded ${completed} hotels to Firestore`);
  process.exit(0);
}

uploadHotels().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
