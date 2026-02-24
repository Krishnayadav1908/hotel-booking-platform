import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function checkHotelsData() {
  const snapshot = await getDocs(collection(db, "hotels"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log(
      `Hotel: ${data.name} | ID: ${doc.id} | Lat: ${data.latitude} | Lng: ${data.longitude}`
    );
  });
}

// Usage example (call this from a component or script):
// checkHotelsData();
