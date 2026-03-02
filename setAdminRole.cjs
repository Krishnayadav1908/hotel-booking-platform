// Set user role as admin in Firestore - Auto-detect users
const admin = require('firebase-admin');
const readline = require('readline');

// Service account key is needed for listing auth users
let serviceAccount;
try {
  serviceAccount = require('./server/serviceAccountKey.json');
} catch (err) {
  console.log('⚠️  Service account key not found.');
  console.log('Download from: https://console.firebase.google.com/project/hotel-booking-16f5a/settings/serviceaccounts/adminsdk');
  console.log('Save as: server/serviceAccountKey.json\n');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function listUsersAndSetAdmin() {
  try {
    console.log('📋 Fetching all users from Firebase Authentication...\n');
    
    // List all users from Firebase Auth
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;
    
    if (users.length === 0) {
      console.log('❌ No users found. Please sign up first at your app.');
      process.exit(1);
    }
    
    console.log(`Found ${users.length} users:\n`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email || 'No email'}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Created: ${user.metadata.creationTime}\n`);
    });
    
    // Ask user to select
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Enter the number of the user to make ADMIN (or press Ctrl+C to cancel): ', async (answer) => {
      rl.close();
      
      const selectedIndex = parseInt(answer) - 1;
      
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= users.length) {
        console.log('❌ Invalid selection!');
        process.exit(1);
      }
      
      const selectedUser = users[selectedIndex];
      
      // Set admin role in Firestore
      await db.collection('users').doc(selectedUser.uid).set({
        email: selectedUser.email,
        role: 'admin',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      console.log(`\n✅ Successfully set ${selectedUser.email} as ADMIN!`);
      console.log(`   UID: ${selectedUser.uid}`);
      console.log('\nYou can now access the Admin Dashboard.');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listUsersAndSetAdmin();
