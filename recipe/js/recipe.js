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
let isRun = false;

function getParam(propaty) {
    return new URLSearchParams(document.location.search).get(propaty)
}

async function Main() {
    try {
        if (await serverFunc() !== 200) return;

        const id = getParam("id");
        const time = getParam("time");

        if (!id || !time) {
            const result = await Swal.fire({
                title: 'データの受信に失敗しました',
                text: 'ページのロード時に受け渡されるデータの読み込みに失敗しました。ホームに自動遷移します。',
                icon: 'error',
                confirmButtonText: 'はい'
            });
            window.location.href = "../";
        } else {
            const recipe = await callapi('get', {
                collection: 'recipe',
                doc: id
            })
            document.querySelector(".container").innerHTML = "";
            if (Object.keys(recipe[time]).length > 0) {
                const recipes = recipe[time]["recipe"];

                document.querySelector(".time").textContent = id.slice(0, 4) + "年" + id.slice(4, 6) + "月" + id.slice(6, 8) + "日－" + time;

                let recipe_num = 0;

                recipes.forEach(item => {
                    const container = document.querySelector(".container");

                    const box = document.createElement("div");
                    box.classList.add("box");

                    if ((recipe_num + 1) !== recipes.length) {
                        box.dataset.border = "";
                    }

                    const box_ttl = document.createElement("h3");
                    box_ttl.classList.add("box_ttl");
                    box_ttl.textContent = item["ttl"];

                    box.appendChild(box_ttl);

                    const box_ingredients = document.createElement("div");
                    box_ingredients.classList.add("box_ingredients");

                    let ninzu_value = "";
                    if (item["ninzu"] !== "0") {
                        ninzu_value = `【 ${item["ninzu"]}人分 】`;
                    } else {
                        ninzu_value = ``;
                    }

                    const ingredients_ttl = document.createElement("h3");
                    ingredients_ttl.classList.add("ingredients_ttl");
                    ingredients_ttl.textContent = `材料${ninzu_value}`;

                    box_ingredients.appendChild(ingredients_ttl);

                    let ingredients_num = 0;

                    const ingredients = item["ingredients"];
                    ingredients.forEach(child => {
                        const ingredient_box = document.createElement("div");
                        ingredient_box.classList.add("ingredient_box");

                        const ingredient_name = document.createElement("h4");
                        ingredient_name.classList.add("ingredient_name");
                        ingredient_name.textContent = child["name"];

                        const ingredient_amount = document.createElement("h4");
                        ingredient_amount.classList.add("ingredient_amount");
                        ingredient_amount.textContent = child["amount"];

                        if ((ingredients_num + 1) == ingredients.length) {
                            ingredient_box.style.borderBottom = "0px";
                        }

                        ingredient_box.appendChild(ingredient_name);
                        ingredient_box.appendChild(ingredient_amount);

                        box_ingredients.appendChild(ingredient_box);

                        ingredients_num++
                    })

                    box.appendChild(box_ingredients);

                    const box_steps = document.createElement("div");
                    box_steps.classList.add("box_steps");

                    const steps_ttl = document.createElement("h3");
                    steps_ttl.classList.add("steps_ttl");
                    steps_ttl.textContent = `【 手順 】`;

                    box_steps.appendChild(steps_ttl);

                    const steps = item["steps"];

                    let step_num = 0;
                    steps.forEach(child => {
                        const steps_box = document.createElement("div");
                        steps_box.classList.add("steps_box");

                        const steps_num_box = document.createElement("div");
                        steps_num_box.classList.add("steps_num");

                        const steps_num = document.createElement("h4");
                        steps_num.textContent = step_num + 1;

                        const steps_name = document.createElement("h4");
                        steps_name.classList.add("steps_name");
                        steps_name.textContent = child;

                        steps_num_box.appendChild(steps_num);

                        steps_box.appendChild(steps_num_box);
                        steps_box.appendChild(steps_name);

                        box_steps.appendChild(steps_box);

                        step_num++
                    })

                    box.appendChild(box_steps);

                    container.appendChild(box);

                    recipe_num++
                });

                const edit_btn = document.createElement("button");
                edit_btn.classList.add("edit_btn");
                edit_btn.textContent = "編集する";

                edit_btn.addEventListener('click', () => {
                    window.location.href = `../setRecipe/?id=${id}&time=${time}`;
                })

                document.querySelector(".container").appendChild(edit_btn);

                return
            }
        }
    } catch (e) {
        const result = await Swal.fire({
            title: 'エラーが発生しました',
            text: `次の通りエラーが発生しました。${e}`,
            icon: 'error',
            confirmButtonText: 'はい'
        });

        console.error(e);
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

            /* mapやforEachで配列型に一括で直そうとすると最後に入力されたデータのみになる */
            /* 原因はわからないが、次のコードで治った */

            let ids = [];
            let datas = [];
            let docList = [];

            const snapshot = await getDocs(postsCollectionRef);

            snapshot.forEach(doc => {
                datas.push(doc.data());
            });

            if (ids.length !== datas.length) return 503;

            for (let i = 0; i < ids.length; i++) {
                docList.push({ id: ids[i], ...datas[i] });
            }

            return docList;
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

        if(typeof db_user == 'number'){
            window.location.href = "https://saigaikinkyuu.github.io/recipe_site/login/"
        }

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