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

let recipes_json = {};
const calenders = [];
let isEvent = false;
let isRun = false;

async function Main() {
    if (await serverFunc() !== 200) return;

    const calender_container = document.querySelector(".calender");
    const last_date = monthLastDate(new Date());
    const month_first_day = monthFirstDay(new Date());
    const cell_number = (last_date + month_first_day) <= 35 ? 35 : 42;
    const next_month_num = (new Date().getMonth() + 2) >= 13 ? [new Date().getFullYear() + 1, (new Date().getMonth() - 10)] : [new Date().getFullYear(), (new Date().getMonth() + 2)];

    const month_btns = document.createElement("div");
    month_btns.classList.add("month_btns");
    month_btns.dataset.select = "1";

    const now_month = document.createElement("button");
    now_month.classList.add("now_month");
    now_month.textContent = `${(new Date().getMonth() + 1)}月`;

    const next_month = document.createElement("button");
    next_month.classList.add("next_month");
    next_month.textContent = `${next_month_num[1]}月`;

    month_btns.appendChild(now_month);
    month_btns.appendChild(next_month);

    now_month.addEventListener('click', () => {
        if (isEvent) return;
        isEvent = true;
        month_btns.dataset.select = "1";
        calenders.forEach(item => {
            item.remove();
        })
        setCalender(last_date, month_first_day, cell_number, [new Date().getFullYear(), (new Date().getMonth() + 1)])
        isEvent = false;
    })

    next_month.addEventListener('click', () => {
        if (isEvent) return;
        isEvent = true;
        month_btns.dataset.select = "2";
        calenders.forEach(item => {
            item.remove();
        })
        const last_date_next = monthLastDate(new Date(`${next_month_num[0]}/${next_month_num[1]}/1 00:00`));
        const month_first_day_next = monthFirstDay(new Date(`${next_month_num[0]}/${next_month_num[1]}/1 00:00`));
        const cell_number_next = (last_date_next + month_first_day_next) <= 35 ? 35 : 42;
        setCalender(last_date_next, month_first_day_next, cell_number_next, next_month_num)
        isEvent = false;
    })

    calender_container.appendChild(month_btns);

    document.querySelector(".todaysMenue").style.display = "none";

    await getRecipeList();
    await setCalender(last_date, month_first_day, cell_number, [new Date().getFullYear(), (new Date().getMonth() + 1)]);
}

async function setCalender(last_date, month_first_day, cell_number, month) {
    const calender_container = document.querySelector(".calender");
    if (calender_container.querySelector(".calender_ttl")) {
        calender_container.querySelector(".calender_ttl").remove();
    }

    const calender_ttl = document.createElement("h2");
    calender_ttl.textContent = month[1] + "月";
    calender_ttl.classList.add("calender_ttl")

    calender_container.appendChild(calender_ttl);

    if (document.querySelector(".list").querySelector(".list_diet_ttl")) {
        document.querySelector(".list").querySelectorAll("*").forEach(item => {
            item.remove();
        })
    }

    const list_defo = document.createElement("h3");
    list_defo.textContent = "確認する日付を選択してください";
    list_defo.classList.add("list_diet_ttl");
    list_defo.classList.add("isNone");

    document.querySelector(".list").appendChild(list_defo);

    for (let i = 1; i <= cell_number; i++) {
        let c = i - month_first_day;
        if ((((i - 1) % 7) == 0 && i !== 1) || i == 1) {
            const week_box = document.createElement("div");
            week_box.classList.add("week");
            if (i == 1) {
                week_box.dataset.wn = "1";
            } else {
                week_box.dataset.wn = (((i - 1) / 7) + 1);
            }

            calender_container.appendChild(week_box);

            calenders.push(week_box);
        }

        const date_box = document.createElement("div");
        date_box.classList.add("date");
        date_box.dataset.d = month[0] + ("0" + month[1]).slice(-2) + ("0" + c).slice(-2);

        calenders.push(date_box);

        const date_txt = document.createElement("p");
        date_txt.classList.add("date_p");

        let isCorrectBox = false;

        if (c > 0 && c <= last_date) {
            date_txt.textContent = c + "日";
            isCorrectBox = true;
        }

        if (i % 7 == 0) {
            date_box.dataset.right = "true";
        } else {
            date_box.dataset.right = "false";
        }

        date_box.appendChild(date_txt);

        const belong_week_box = document.querySelector(".week[data-wn='" + ((((i - 1) - ((i - 1) % 7)) / 7) + 1) + "']");

        if (!belong_week_box) {
            console.error("fetch_error");
        } else {
            belong_week_box.appendChild(date_box);
        }

        if (date_box.dataset.d == (new Date().getFullYear() + ("0" + (new Date().getMonth() + 1)).slice(-2) + ("0" + new Date().getDate()).slice(-2))) {
            date_box.dataset.set = "today";
        } else if (recipes_json[date_box.dataset.d] && isCorrectBox) {
            date_box.dataset.set = "true";
        } else if (!recipes_json[date_box.dataset.d] && isCorrectBox) {
            date_box.dataset.set = "false";
        } else {
            continue
        }

        date_box.addEventListener('click', () => {
            document.querySelector(".list").innerHTML = "";
            if (recipes_json[date_box.dataset.d]) {
                const diet_txt = ["朝食", "昼食", "夕食"];
                const diet_txt_en = ["breakfast", "lunch", "dinner"];
                const diet = [];
                diet.push(recipes_json[date_box.dataset.d]["breakfast"]);
                diet.push(recipes_json[date_box.dataset.d]["lunch"]);
                diet.push(recipes_json[date_box.dataset.d]["dinner"]);

                const div_list = document.querySelector(".list");

                const list_ttl_head = document.createElement("h2");
                list_ttl_head.classList.add("list_ttl_head");
                list_ttl_head.textContent = (date_box.dataset.d).slice(0, 4) + "年" + (date_box.dataset.d).slice(4, 6) + "月" + (date_box.dataset.d).slice(6, 8) + "日";

                div_list.appendChild(list_ttl_head);

                for (let i = 0; i < diet.length; i++) {
                    const list_ttl = document.createElement("h3");
                    list_ttl.classList.add("list_ttl");
                    list_ttl.textContent = `【 ${diet_txt[i]} 】`;

                    div_list.appendChild(list_ttl);
                    if (diet[i]) {
                        if (Object.keys(diet[i]).length) {
                            const diet_json = diet[i]["recipe"];
                            const diet_lists = document.createElement("div");
                            diet_lists.classList.add("diet_lists");
                            diet_json.forEach(item => {
                                const list_diet_ttl = document.createElement("h3");
                                list_diet_ttl.classList.add("list_diet_ttl");
                                list_diet_ttl.textContent = item["ttl"];

                                diet_lists.appendChild(list_diet_ttl);
                            });

                            div_list.appendChild(diet_lists);

                            const recipe_btn = document.createElement("button");
                            recipe_btn.classList.add("recipe_btn");
                            recipe_btn.textContent = "レシピを開く";

                            div_list.appendChild(recipe_btn);

                            recipe_btn.addEventListener('click', () => {
                                window.location.href = `./recipe/?id=${date_box.dataset.d}&time=${diet_txt_en[i]}`;
                            })

                            continue
                        }
                    }
                    const diet_lists = document.createElement("div");
                    diet_lists.classList.add("diet_lists");

                    const diet_none_txt = document.createElement("h3");
                    diet_none_txt.classList.add("list_diet_ttl");
                    diet_none_txt.classList.add("isNone");
                    diet_none_txt.textContent = "！レシピが登録されていません！";

                    div_list.appendChild(diet_none_txt);

                    const recipe_btn = document.createElement("button");
                    recipe_btn.classList.add("recipe_btn");
                    recipe_btn.textContent = "レシピを登録する";

                    div_list.appendChild(recipe_btn);

                    recipe_btn.addEventListener('click', () => {
                        window.location.href = `./setRecipe/?id=${date_box.dataset.d}&time=${diet_txt_en[i]}`;
                    })

                }
            } else {
                const diet_txt = ["朝食", "昼食", "夕食"];
                const diet_txt_en = ["breakfast", "lunch", "dinner"];
                const diet = [];
                diet.push(null);
                diet.push(null);
                diet.push(null);

                const div_list = document.querySelector(".list");

                const list_ttl_head = document.createElement("h2");
                list_ttl_head.classList.add("list_ttl_head");
                list_ttl_head.textContent = (date_box.dataset.d).slice(0, 4) + "年" + (date_box.dataset.d).slice(4, 6) + "月" + (date_box.dataset.d).slice(6, 8) + "日";

                div_list.appendChild(list_ttl_head);

                for (let i = 0; i < diet.length; i++) {
                    const list_ttl = document.createElement("h3");
                    list_ttl.classList.add("list_ttl");
                    list_ttl.textContent = `【 ${diet_txt[i]} 】`;

                    div_list.appendChild(list_ttl);

                    const diet_lists = document.createElement("div");
                    diet_lists.classList.add("diet_lists");

                    const diet_none_txt = document.createElement("h3");
                    diet_none_txt.classList.add("list_diet_ttl");
                    diet_none_txt.classList.add("isNone");
                    diet_none_txt.textContent = "！レシピが登録されていません！";

                    div_list.appendChild(diet_none_txt);

                    const recipe_btn = document.createElement("button");
                    recipe_btn.classList.add("recipe_btn");
                    recipe_btn.textContent = "レシピを登録する";

                    div_list.appendChild(recipe_btn);

                    recipe_btn.addEventListener('click', () => {
                        window.location.href = `./setRecipe/?id=${date_box.dataset.d}&time=${diet_txt_en[i]}`;
                    })
                }
            }
        })
    }
}

async function getRecipeList() {
    try {
        const data = await callapi('list', {
            collection: 'recipe'
        })

        if (typeof data == 'number') {
            const result = await Swal.fire({
                title: 'リクエストに失敗しました',
                text: '数分後に再度お試しください',
                icon: 'error',
                confirmButtonText: 'はい'
            });
            return
        }

        console.log(data);

        let recipes = data.shift();

        const now_h = new Date().getHours();
        const id_t = new Date().getFullYear() + ("0" + (new Date().getMonth() + 1)).slice(-2) + ("0" + new Date().getDate()).slice(-2);
        let extra_txt = "";

        const ext_to_jp = { "breakfast": "朝食", "lunch": "昼食", "dinner": "夕食" };

        if (4 <= now_h && now_h <= 10) {
            extra_txt = "breakfast";
        } else if (11 <= now_h && now_h <= 14) {
            extra_txt = "lunch";
        } else if (15 <= now_h && now_h <= 22) {
            extra_txt = "dinner";
        }

        recipes.forEach(element => {
            if (element["id"] == 'test') return;
            if (element["id"] == id_t && element[extra_txt]) {
                if (Object.keys(element[extra_txt]).length > 0) {
                    const today_ttl = document.createElement("h2");
                    today_ttl.textContent = "本日の【" + ext_to_jp[extra_txt] + "】";
                    today_ttl.classList.add("today_ttl");

                    const today_ul = document.createElement("ul");
                    today_ul.classList.add("today_ul");

                    const recipes_elem = element[extra_txt]["recipe"];
                    recipes_elem.forEach(item => {
                        const today_li = document.createElement("li");
                        today_li.classList.add("today_li");
                        today_li.textContent = item["ttl"];

                        today_ul.appendChild(today_li);
                    })

                    document.querySelector(".todaysMenue").appendChild(today_ttl);
                    document.querySelector(".todaysMenue").appendChild(today_ul);

                    document.querySelector(".todaysMenue").style.display = "block";

                    today_ul.addEventListener('click', () => {
                        window.location.href = `./recipe/?id=${element["id"]}&time=${extra_txt}`;
                    })
                }
            }

            recipes_json[element["id"]] = {};
            recipes_json[element["id"]] = element;
        });

    } catch (e) {
        console.error(e);
    }
}

function monthLastDate(newDate) {
    const first_mon = 6;

    if (newDate.getMonth() <= first_mon) {
        if ((newDate.getMonth() % 2) == 0) {
            return 31
        } else {
            if (newDate.getMonth() == 1) {
                if ((newDate.getFullYear() % 4) == 0) {
                    return 29
                } else {
                    return 28
                }
            }
            return 30
        }
    } else {
        if ((newDate.getMonth() % 2) == 0) {
            return 30
        } else {
            return 31
        }
    }
}

function monthFirstDay(newDate) {
    return new Date(newDate.getFullYear() + "/" + ("0" + (newDate.getMonth() + 1)).slice(-2) + "/01").getDay()
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

            let id_data = [];

            const documents = snapshot.docs.map((doc) => {
                id_data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return id_data;
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