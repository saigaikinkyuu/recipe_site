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

function getParam(propaty) {
    return new URLSearchParams(document.location.search).get(propaty)
}

async function Main() {
    try {
        const id = getParam("id");
        const time = getParam("time");

        document.querySelector(".container").innerHTML = "";

        if (!id || !time) {
            const result = await Swal.fire({
                title: 'データの受信に失敗しました',
                text: 'ページのロード時に受け渡されるデータの読み込みに失敗しました。ホームに自動遷移します。',
                icon: 'error',
                confirmButtonText: 'はい'
            });
            window.location.href = "../";
        } else {
            const unsubscribe = db.collection("recipe")
                .doc(id)
                .onSnapshot(async (snapshot) => {
                    if (snapshot.exists) {
                        const recipe = snapshot.data();
                        if (recipe[time]) {
                            const recipes = recipe[time]["recipe"];

                            document.querySelector(".time").textContent = id.slice(0,4) + "年" + id.slice(4,6) + "月" + id.slice(6,8) + "日－" + time;

                            recipes.forEach(item => {
                                const container = document.querySelector(".container");

                                const box = document.createElement("div");
                                box.classList.add("box");

                                const box_ttl = document.createElement("h3");
                                box_ttl.classList.add("box_ttl");
                                box_ttl.textContent = item["ttl"];

                                box.appendChild(box_ttl);

                                const box_ingredients = document.createElement("div");
                                box_ingredients.classList.add("box_ingredients");

                                const ingredients_ttl = document.createElement("h3");
                                ingredients_ttl.classList.add("ingredients_ttl");
                                ingredients_ttl.textContent = `材料【 ${item["ninzu"]} 】`;

                                box_ingredients.appendChild(ingredients_ttl);

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

                                    ingredient_box.appendChild(ingredient_name);
                                    ingredient_box.appendChild(ingredient_amount);

                                    box_ingredients.appendChild(ingredient_box);
                                })

                                box.appendChild(box_ingredients);

                                const box_steps = document.createElement("div");
                                box_steps.classList.add("box_steps");

                                const steps = item["steps"];

                                let step_num = 0;
                                steps.forEach(child => {
                                    const steps_box = document.createElement("div");
                                    steps_box.classList.add("steps_box");

                                    const steps_num = document.createElement("h4");
                                    steps_num.classList.add("steps_num");
                                    steps_num.textContent = step_num;

                                    const steps_name = document.createElement("h4");
                                    steps_name.classList.add("steps_name");
                                    steps_name.textContent = child;

                                    steps_box.appendChild(steps_num);
                                    steps_box.appendChild(steps_name);

                                    box_steps.appendChild(steps_box);

                                    step_num++
                                })

                                box.appendChild(box_steps);

                                container.appendChild(box);
                            });

                            return
                        }
                    }
                    const result = await Swal.fire({
                        title: 'データがありません',
                        text: 'リクエストのデータは削除された可能性があります。',
                        icon: 'error',
                        confirmButtonText: 'はい'
                    });
                    window.location.href = "../";

                })
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

auth.onAuthStateChanged(user => {
    if (user) {
        const unsubscribe = db.collection("server")
            .doc("db")
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    const db_data = snapshot.data();

                    if (db_data["status"] == "stop") {
                        window.location.href = "../error";
                    }
                }
            })

        Main();
    } else {
        window.location.href = "../login";
    }
})