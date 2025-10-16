if (typeof firebaseConfig == 'undefined') {
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
}

var isRun = false;
auth.onAuthStateChanged(async user => {
    if (user) {
        const userdata = await db.collection("users")
            .doc(user.uid)
            .get();

        const user_data = userdata.data();

        const unsubscribe = db.collection("server")
            .doc("db")
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    const db_data = snapshot.data();

                    let isRedirect = false;

                    if (db_data["status"] == "stop") {
                        if (user_data["status"] == "admin") {
                            if (!isRun) {
                                isRun = true;
                                Swal.fire({
                                    icon: 'info',
                                    position: 'top-end',
                                    toast: true,
                                    title: 'SERVER STATUS : STOP',
                                    text: 'アドミン権限で停止しているサーバーに接続しています。',
                                })
                                Main();
                            }
                            return
                        }
                        window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
                        isRedirect = true;
                    } else if (!isRun) {
                        Main();
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
                }
                isRun = true;
            })
    } else {
        window.location.href = "https://saigaikinkyuu.github.io/recipe_site/login/";

        window.body = "";
        document.body.addEventListener('click', () => {
            window.location.href = "https://saigaikinkyuu.github.io/recipe_site/login/";
        })
    }
})