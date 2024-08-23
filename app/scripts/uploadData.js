import dotenv from 'dotenv';
import { Firestore } from '@google-cloud/firestore';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// Initialize Firestore with the service account key
const firestore = new Firestore({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Verify Firestore initialization
console.log('Firestore initialized.');

// Function to sanitize document ID
function sanitizeDocId(id) {
  return id.replace(/[\/\(\)]+/g, '-'); // Replace / and () with hyphens
}

async function uploadData() {
  try {
    // Path to your JSON data file
    const filePath = path.join(path.resolve(), 'app/data/universities.json');
    
    // Read and parse JSON data
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Log the parsed data to verify its structure
    console.log('Data read from file:', data);

    // Ensure data is an array
    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }
    
    // Example: Upload each university to Firestore
    const batch = firestore.batch();
    data.forEach(university => {
      const sanitizedId = sanitizeDocId(university['Institution Name']);
      const docRef = firestore.collection('universities').doc(sanitizedId);
      batch.set(docRef, university);
    });
    
    // Commit the batch
    await batch.commit();
    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading data:', error);
  }
}

// Call the function to upload data
uploadData();
