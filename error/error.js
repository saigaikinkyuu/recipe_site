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

auth.onAuthStateChanged(user => {
    if (user) {
        const unsubscribe = db.collection("server")
        .doc("db")
        .onSnapshot((snapshot) => {
            if (snapshot.exists) {
                const db_data = snapshot.data();

                if(db_data["status"] == "stop"){
                    document.querySelector(".container").querySelector("p").textContent = db_data["mes"];
                }else {
                    window.location.href = "../";
                }
            }
        })
    }else {
        window.location.href = "../login";
    }
})