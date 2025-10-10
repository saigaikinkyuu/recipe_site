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

let recipes_json = {};

async function Main(){
    const calender_container = document.querySelector(".calender");
    const last_date = monthLastDate(new Date());
    const month_first_day = monthFirstDay(new Date());
    const cell_number = (last_date + month_first_day) <= 28 ? 28 : 35;

    const calender_ttl = document.createElement("h2");
    calender_ttl.textContent = (new Date().getMonth() + 1) + "月";
    calender_ttl.classList.add("calender_ttl")

    calender_container.appendChild(calender_ttl);

    await getRecipeList();

    for(let i = 1; i <= cell_number; i++){
        let c = i - month_first_day;
        if((((i - 1) % 7) == 0 && i !== 1) || i == 1){
            const week_box = document.createElement("div");
            week_box.classList.add("week");
            if(i == 1){
                week_box.dataset.wn = "1";
            }else {
                week_box.dataset.wn = (((i - 1) / 7) + 1);
            }

            calender_container.appendChild(week_box);
        }

        const date_box = document.createElement("div");
        date_box.classList.add("date");
        date_box.dataset.d = new Date().getFullYear() + ("0" + (new Date().getMonth() + 1)).slice(-2) + ("0" + new Date().getDate()).slice(-2);

        const date_txt = document.createElement("p");
        date_txt.classList.add("date_p");

        if(c > 0 && c <= last_date){
            date_txt.textContent = c + "日";
        }

        if(i % 7 == 0){
            date_box.dataset.right = "true";
        }else {
            date_box.dataset.right = "false";
        }

        date_box.appendChild(date_txt);

        const belong_week_box = document.querySelector(".week[data-wn='" + ((((i - 1) - ((i - 1) % 7)) / 7) + 1) + "']");

        if(!belong_week_box){
            console.error("fetch_error");
        }else {
            belong_week_box.appendChild(date_box);
        }

        if(recipes_json[date_box.dataset.d]){
            date_box.dataset.set = "true";
        }else {
            date_box.dataset.set = "false";
        }

        date_box.addEventListener('click' , () => {
            if(recipes_json[date_box.dataset.d]){
                const diet_txt = ["朝食" , "昼食" , "夕食"];
                const diet_txt_en = ["breakfast" , "lunch" , "dinner"];
                const diet = [];
                diet.push(recipes_json[date_box.dataset.d]["mornning"]);
                diet.push(recipes_json[date_box.dataset.d]["lunch"]);
                diet.push(recipes_json[date_box.dataset.d]["dinner"]);

                const div_list = document.querySelector(".list");

                const list_ttl_head = document.createElement("h2");
                list_ttl_head.classList.add("list_ttl_head");
                list_ttl_head.textContent = (date_box.dataset.d).slice(0,4) + "年" + (date_box.dataset.d).slice(4,6) + "月" + (date_box.dataset.d).slice(6,8);

                for(let i = 0;i < diet.length;i++){
                    const list_ttl = document.createElement("h3");
                    list_ttl.classList.add("list_ttl");
                    list_ttl.textContent = `【 ${diet_txt[i]} 】`;

                    div_list.appendChild(list_ttl);
                    if(diet[i]){
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

                        recipe_btn.addEventListener('click' , () => {
                            window.location.href = `./recipe/?id=${date_box.dataset.d}&time=${diet_txt_en[i]}`;
                        })
                    }else {
                        const diet_lists = document.createElement("div");
                        diet_lists.classList.add("diet_lists");

                        const diet_none_txt = document.createElement("h3");
                        diet_none_txt.classList.add("list_diet_ttl");
                        diet_none_txt.textContent = "レシピが登録されていません";

                        div_list.appendChild(diet_none_txt);

                        const recipe_btn = document.createElement("button");
                        recipe_btn.classList.add("recipe_btn");
                        recipe_btn.textContent = "レシピを登録する";

                        div_list.appendChild(recipe_btn);

                        recipe_btn.addEventListener('click' , () => {
                            window.location.href = `./setRecipe/?id=${date_box.dataset.d}&time=${diet_txt_en[i]}`;
                        })
                    }
                }
            }else {
                const diet_txt = ["朝食" , "昼食" , "夕食"];
                const diet_txt_en = ["breakfast" , "lunch" , "dinner"];
                const diet = [];
                diet.push(null);
                diet.push(null);
                diet.push(null);

                const div_list = document.querySelector(".list");

                const list_ttl_head = document.createElement("h2");
                list_ttl_head.classList.add("list_ttl_head");
                list_ttl_head.textContent = (date_box.dataset.d).slice(0,4) + "年" + (date_box.dataset.d).slice(4,6) + "月" + (date_box.dataset.d).slice(6,8);

                for(let i = 0;i < diet.length;i++){
                    const list_ttl = document.createElement("h3");
                    list_ttl.classList.add("list_ttl");
                    list_ttl.textContent = `【 ${diet_txt[i]} 】`;

                    div_list.appendChild(list_ttl);
                    if(diet[i]){
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

                        recipe_btn.addEventListener('click' , () => {
                            window.location.href = `./recipe/?id=${date_box.dataset.d}&time=${diet_txt_en[i]}`;
                        })
                    }else {
                        const diet_json = diet[i]["recipe"];
                        const diet_lists = document.createElement("div");
                        diet_lists.classList.add("diet_lists");

                        const diet_none_txt = document.createElement("h3");
                        diet_none_txt.classList.add("list_diet_ttl");
                        diet_none_txt.textContent = "レシピが登録されていません";

                        div_list.appendChild(diet_none_txt);

                        const recipe_btn = document.createElement("button");
                        recipe_btn.classList.add("recipe_btn");
                        recipe_btn.textContent = "レシピを登録する";

                        div_list.appendChild(recipe_btn);

                        recipe_btn.addEventListener('click' , () => {
                            window.location.href = `./setRecipe/?id=${date_box.dataset.d}&time=${diet_txt_en[i]}`;
                        })
                    }
                }
            }
        })
    }
}

async function getRecipeList(){
    try{
        const snapshot = await db.collection("recipe").get(); 
        
        const recipes = [];
        snapshot.forEach(doc => {
            // ドキュメントIDとデータを取得
            recipes.push({
                id: doc.id,
                ...doc.data()
            });
        });

        const now_h = new Date().getHours();
        const id_t = new Date().getFullYear() + ("0" + (new Date().getMonth() + 1)).slice(-2) + ("0" + new Date().getDate()).slice(-2);
        let extra_txt = "";

        const ext_to_jp = {"breakfast" : "朝食" , "lunch" : "昼食" , "dinner" : "夕食"};

        if(4 <= now_h && now_h <= 10){
            extra_txt = "breakfast";
        }else if(11 <= now_h && now_h <= 14){
            extra_txt = "lunch";
        }else if(15 <= now_h && now_h <= 22){
            extra_txt = "dinner";
        }

        recipes.forEach(element => {
            if(element["id"] == id_t && element["id"][extra_txt]){
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

                document.querySelector("todaysMenue").appendChild(today_ttl);
                document.querySelector("todaysMenue").appendChild(today_ul);

                today_ul.addEventListener('click' , () => {
                    window.location.href = `./recipe/?id=${element["id"]}&time=${extra_txt}`;
                })
            }

            recipes_json[element["id"]] = {};
            recipes_json[element["id"]][extra_txt] = element[extra_txt]["recipe"];
        });

    }catch(e){
        console.error(e);
    }
}

function monthLastDate(newDate){
    // jan-jul
    const first_mon = 6;

    if(newDate.getMonth() <= first_mon){
        if((newDate.getMonth() % 2) == 0){
            return 31
        }else {
            if(newDate.getMonth() == 1){
                if((newDate.getFullYear() % 4) == 0){
                    return 29
                }else {
                    return 28
                }
            }
            return 30
        }
    }else {
        if((newDate.getMonth() % 2) == 0){
            return 30
        }else {
            return 31
        }
    }
}

function monthFirstDay(newDate){
    return new Date(newDate.getFullYear() + "/" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "/01").getDay()
}

auth.onAuthStateChanged(user => {
    if (user) {
        const unsubscribe = db.collection("server")
        .doc("db")
        .onSnapshot((snapshot) => {
            if (snapshot.exists) {
                const db_data = snapshot.data();

                if(db_data["status"] == "stop"){
                    window.location.href = "./error";
                }
            }
        })
        Main();
    }else {
        window.location.href = "./login";
    }
})