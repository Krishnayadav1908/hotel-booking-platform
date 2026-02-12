// Script to upload db.json data to Firestore
// 1. Install dependencies: npm install firebase-admin
// 2. Download your Firebase service account key and set the path below
// 3. Run: node uploadToFirestore.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');


// Service account key is inside the server folder
const serviceAccount = require('./server/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Path to your db.json file
const dbJsonPath = path.join(__dirname, 'server/db.json');
const data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

async function uploadCollection(collectionName, items) {
  if (!Array.isArray(items) || items.length === 0) {
    console.log(`No documents to upload for ${collectionName}`);
    return;
  }
  const batch = db.batch();
  items.forEach((item) => {
    const docRef = db.collection(collectionName).doc(item.id ? String(item.id) : undefined);
    batch.set(docRef, item);
  });
  await batch.commit();
  console.log(`Uploaded ${items.length} documents to ${collectionName}`);
}

async function main() {
  for (const [collection, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      await uploadCollection(collection, items);
    }
  }
  console.log('All data uploaded!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
