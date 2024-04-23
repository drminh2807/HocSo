import { initializeApp } from "firebase/app"
import { getStorage, getDownloadURL, ref } from "firebase/storage"

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCh1cXbhVZovc3dGVnX1ywT5Dd3JwQKRxM",
  authDomain: "hocsochobe.firebaseapp.com",
  projectId: "hocsochobe",
  storageBucket: "hocsochobe.appspot.com",
  messagingSenderId: "444051826642",
  appId: "1:444051826642:web:faa9b78c7c05a158788a0b",
  measurementId: "G-JRVYV0DVJ7",
}

const firebaseApp = initializeApp(firebaseConfig)
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
const storage = getStorage(firebaseApp, "gs://hocsochobe.appspot.com")

export const getImageUrl = (word: string) => getDownloadURL(ref(storage, `images/${word}.jpg`))
export const getAudioUrl = (word: string, lang: "en" | "vi") =>
  getDownloadURL(ref(storage, `${lang}/${word}.wav`))
