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
    const user = firebase.auth().currentUser;
    const idToken = await user.getIdToken();

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

    res.json().then(async (user) => {
        return user;
    })
}