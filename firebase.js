// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
import 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUY4JvT4M_pjc5hnm3E8YcCfqbOmvXWzU",
  authDomain: "fir-b3282.firebaseapp.com",
  projectId: "fir-b3282",
  storageBucket: "fir-b3282.appspot.com",
  messagingSenderId: "606559030723",
  appId: "1:606559030723:web:bde16b81e730eb6ccdc176",
  measurementId: "G-Q40LTKHCN9"
};


// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()
var db = firebase.firestore(app)

export { auth };
export { db };
