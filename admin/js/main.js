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

async function Main() {
    try {
        const code_script = await callapi('get', {
            collection: 'script',
            doc: 'admin'
        })

        const adminFunc = new Function('db', 'auth', 'doc', 'collection', 'setDoc', 'getDoc', 'getDocs', 'updateDoc', 'deleteDoc', code_script["txt"]);

        const dynamicAsyncFunction = adminFunc(db, auth, doc, collection, setDoc, getDoc, getDocs, updateDoc, deleteDoc);

        await dynamicAsyncFunction();
    } catch (e) {
        console.error(e);
        const result = await Swal.fire({
            title: '処理の実行に失敗しました',
            text: e,
            icon: 'error',
            confirmButtonText: 'はい'
        });
        if (e.name == "FirebaseError") {
            const result = await Swal.fire({
                title: 'アクセス権限がありません',
                text: 'アクセスには管理者から認証される必要があります。',
                icon: 'error',
                confirmButtonText: 'はい'
            });

            window.location.href = "../";
        }
    }
}

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

            await updateDoc(postDocRef, body.data);

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

async function serverFunc() {
    try {
        const user = getAuth().currentUser;
        const db_user = await callapi('get', {
            collection: 'users',
            doc: user.uid
        });

        const db_data = await callapi('get', {
            collection: 'server',
            doc: 'db'
        });

        let isRedirect = false;

        if (db_data["status"] == "stop") {
            if (db_user["status"] == "admin") {
                Swal.fire({
                    icon: 'info',
                    position: 'top-end',
                    toast: true,
                    title: 'SERVER STATUS : STOP',
                    text: 'アドミン権限で停止しているサーバーに接続しています。',
                })
                if (!isRun) {
                    isRun = true;
                    return 200;
                }
                return
            }
            window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
            isRedirect = true;
        } else if (!isRun) {
            return 200;
        }

        if (isRedirect) {
            const iframe = document.createElement("iframe");
            iframe.href = "https://saigaikinkyuu.github.io/recipe_site/error/";

            document.body.appendChild(iframe);
            document.title = "Error";

            document.body.addEventListener('click', () => {
                window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
            })
        }
        isRun = true;
    } catch (e) {
        console.error(e);
        window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
    }
}

onAuthStateChanged(auth, (user) => {
    Main();
})