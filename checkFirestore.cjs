// Check if hotels exist in Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function checkHotels() {
  try {
    const hotelsRef = collection(db, 'hotels');
    const snapshot = await getDocs(hotelsRef);
    
    console.log(`\n✅ Found ${snapshot.size} hotels in Firestore!\n`);
    
    if (snapshot.size > 0) {
      console.log('First 5 hotels:');
      snapshot.docs.slice(0, 5).forEach(doc => {
        const data = doc.data();
        console.log(`  - ID: ${doc.id} | Name: ${data.name} | Location: ${data.city || data.smart_location}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkHotels();
