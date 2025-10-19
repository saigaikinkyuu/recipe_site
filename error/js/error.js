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

async function getUserData() {
    const db = await openDatabase();
    
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    
    return new Promise((resolve, reject) => {
        const request = store.get(1);

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
    getUserData().then(user => {
        const idToken = user.userId;

        if (!idToken) {
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
    });
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