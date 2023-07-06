// Import the functions you need from the SDKs you need
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { initializeApp } from 'firebase/app'
import { doc, getFirestore } from 'firebase/firestore'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// NOTE: Zetian
const firebaseConfig0 = {
  apiKey: 'AIzaSyArC2oFHyAeSCPIK6AAMbghWW5fL2jExqY',
  authDomain: 'localservice-381523.firebaseapp.com',
  projectId: 'localservice-381523',
  storageBucket: 'localservice-381523.appspot.com',
  messagingSenderId: '14918885764',
  appId: '1:14918885764:web:6e745429f0da6f2947fdd1',
  measurementId: 'G-R1D2V9VWR8',
}

// NOTE: Temp
const firebaseConfig1 = {
  apiKey: 'AIzaSyC2LHe5DmEPinamn3ea8AhzDvGl78qCYX4',
  authDomain: 'temp-fbef4.firebaseapp.com',
  projectId: 'temp-fbef4',
  storageBucket: 'temp-fbef4.appspot.com',
  messagingSenderId: '513327102579',
  appId: '1:513327102579:web:00f4ca289766248031c806',
}

// Test [db rules closed]
const firebaseConfig2 = {
  apiKey: 'AIzaSyDW_my4UYQabntxpIuPIJaMfmdf64XVuIU',
  authDomain: 'test-36dcf.firebaseapp.com',
  projectId: 'test-36dcf',
  storageBucket: 'test-36dcf.appspot.com',
  messagingSenderId: '442848617497',
  appId: '1:442848617497:web:19c2b70ea34f104eb3f688',
}

// Final release version
const firebaseConfig = {
  apiKey: 'AIzaSyCs29LNm5gEcS4cRuwgCsXN06ybwnKT83Y',
  authDomain: 'find-a-service-818a4.firebaseapp.com',
  projectId: 'find-a-service-818a4',
  storageBucket: 'find-a-service-818a4.appspot.com',
  messagingSenderId: '1058704951877',
  appId: '1:1058704951877:web:41b27b37e8fc873be9f12c',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
