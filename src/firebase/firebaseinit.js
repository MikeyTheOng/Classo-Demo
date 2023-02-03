import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvSy3aKrO8opaKJHb8Q36Mb1bHkybfjS8",
  authDomain: "classo-vue-app.firebaseapp.com",
  projectId: "classo-vue-app",
  storageBucket: "classo-vue-app.appspot.com",
  messagingSenderId: "645733472341",
  appId: "1:645733472341:web:2da730cd23fd7a02179cdc",
};


// initialize firebase app
const app = initializeApp(firebaseConfig);

// initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// db.settings({ timeStampsInSnapshots: true });

export { auth, db };
export default app;
