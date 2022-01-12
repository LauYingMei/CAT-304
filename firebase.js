// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
import 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHMc6k8NZRMgvRshJNAZZvg3cyThLe7vg",
  authDomain: "serene-art-315102.firebaseapp.com",
  databaseURL: "https://serene-art-315102-default-rtdb.firebaseio.com",
  projectId: "serene-art-315102",
  storageBucket: "serene-art-315102.appspot.com",
  messagingSenderId: "398430343168",
  appId: "1:398430343168:web:46fab7e081592739a688e5",
  measurementId: "G-H1P7XW23RF"
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
var storage = firebase.storage()

export { auth };
export { db };
export { storage };
