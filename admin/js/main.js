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
        const code = await db.collection("script")
            .doc("admin")
            .get();

        const code_script = code.data();

        const blob = new Blob([code_script["txt"]], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);

        async function runDynamicModule() {
            console.log("Importing dynamic module...");

            try {
                const module = await import(url);

                await module.fetchData();
            } catch (error) {
                console.error("Dynamic import error:", error);
            } finally {
                URL.revokeObjectURL(url);
            }
        }

        runDynamicModule();

        /*const displayFunc = new Function(code_script["txt"]);

        displayFunc();*/
    } catch (e) {
        console.error(e);
        const result = await Swal.fire({
            title: '処理の実行に失敗しました',
            text: e,
            icon: 'error',
            confirmButtonText: 'はい'
        });
    }
}