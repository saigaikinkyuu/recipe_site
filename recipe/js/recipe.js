function getParam(propaty) {
    return new URLSearchParams(document.location.search).get(propaty)
}

async function Main() {
    try {
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