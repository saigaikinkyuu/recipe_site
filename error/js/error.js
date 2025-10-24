import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, collection, getDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app-check.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzslg1WbmtYBNFtR3BrrHVvXYTeqanDr8",
    authDomain: "home-recipe-be23b.firebaseapp.com",
    projectId: "home-recipe-be23b",
    storageBucket: "home-recipe-be23b.firebasestorage.app",
    messagingSenderId: "801879261323",
    appId: "1:801879261323:web:0d2f9552d1058ee99d948e",
    measurementId: "G-Y12V9FEK27"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const RECAPTCHA_SITE_KEY = "6LeJnu8rAAAAACzYKvXoSxPDfgWlKHa7ftgB2GYN";

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
    isProactiveRefresh: true
});
const db = getFirestore(app);

(async () => {
    try {
        const data = await callapi('get', {
            collection: 'server',
            doc: 'db'
        })

        if (data["status"] == "stop") {
            document.querySelector(".container").querySelector("p").innerText = data["mes"];
        } else {
            window.location.href = "../";
        }
    } catch (e) {
        console.error(e);
        window.location.href = "../login";
    }
})

async function callapi(action, body) {
    try {
        const user = auth.currentUser;
        if (action == 'get') {
            const postDocRef = doc(db, body.collection, body.doc);

            const docSnap = await getDoc(postDocRef);

            if (docSnap.exists()) {
                const postData = { id: docSnap.id, ...docSnap.data() };
                return postData;
            } else {
                return 503;
            }
        } else if (action == 'list') {
            const postsCollectionRef = collection(db, body.collection);

            const snapshot = await getDocs(postsCollectionRef);

            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return posts;
        } else if (action == 'create') {
            const docRef = doc(db, body.collection, body.doc);
            await setDoc(docRef, body.data);

            return 200;
        } else if (action == 'update') {
            const postDocRef = doc(db, body.collection, body.doc);

            await updateDoc(postDocRef, updates);

            return 200;
        } else if (action == 'delete') {
            const postDocRef = doc(db, body.collection, body.doc);

            await deleteDoc(postDocRef);

            return 200;
        }
    } catch (e) {
        console.error(e);

        return 503;
    }
}