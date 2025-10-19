const firebaseConfig = {
    apiKey: "AIzaSyDzslg1WbmtYBNFtR3BrrHVvXYTeqanDr8",
    authDomain: "home-recipe-be23b.firebaseapp.com",
    projectId: "home-recipe-be23b",
    storageBucket: "home-recipe-be23b.firebasestorage.app",
    messagingSenderId: "801879261323",
    appId: "1:801879261323:web:0d2f9552d1058ee99d948e",
    measurementId: "G-Y12V9FEK27"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();

async function Main() {
    try {
        const code_script = await callapi('get' , {
            collection: 'script',
            doc: 'admin'
        })

        const adminFunc = new Function(code_script["txt"]);

        const dynamicAsyncFunction = adminFunc(db);

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

async function getUserData() {
    const db = await openDatabase();
    
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    
    return new Promise((resolve, reject) => {
        const request = store.get("userId");

        request.onsuccess = (event) => {
            resolve(event.target.result); 
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
        
        transaction.oncomplete = () => {
            db.close();
        };
    });
}

async function callapi(action, body) {
    const idToken = await getUserData();

    if (!user) {
        throw new Error("Not authenticated");
    }

    const res = await fetch(`https://firebaseapidataserver.netlify.app/.netlify/functions/api/${action}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "API request failed");
    }

    return res.json();
}

async function openDatabase(){
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('authDatabase', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};