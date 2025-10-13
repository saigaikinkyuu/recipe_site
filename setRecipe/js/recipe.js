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

const db_json = { "exist": null, "data": {} };

var error_disavailabled_submit = false;

function getParam(propaty) {
    return new URLSearchParams(document.location.search).get(propaty)
}

function getAllLocalStorageData() {
    const allData = {};
    const storageLength = localStorage.length;

    for (let i = 0; i < storageLength; i++) {
        const key = localStorage.key(i);

        const valueString = localStorage.getItem(key);

        let parsedValue;
        try {
            parsedValue = JSON.parse(valueString);
        } catch (e) {
            parsedValue = valueString;
        }

        allData[key] = parsedValue;
    }

    return allData;
}

async function Main() {
    const id = getParam("id");
    const time = getParam("time");

    if (!id || !time) {
        window.location.href = "../";
    } else {
        document.querySelector("form").innerHTML = `<button class="add_submit cook_add">＋</button><button id="submit">送信</button>`;
        await getDB(id);
        await addForm();
        await setData(time);

        const ttl = document.querySelector("h3");
        const cook_submit = document.querySelector(".cook_add");
        const submit = document.querySelector("#submit");

        ttl.textContent = `${id.slice(0, 4)}年${id.slice(4, 6)}月${id.slice(6, 8)}日－${time}`;

        submit.addEventListener('click', async (e) => {
            const cook_json = [];
            try {
                e.preventDefault();
                if (error_disavailabled_submit) {
                    Swal.fire('実行中の予期せぬエラーにより処理を停止しました。', '', 'error');
                    return
                }

                const cook_fir_ttl_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".ttl");
                const cook_fir_ninzu_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".ninzu");
                const cook_fir_ingredients_name_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".ingredients_box").querySelector("div").querySelector(".ingredients_name");
                const cook_fir_ingredients_amount_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".ingredients_box").querySelector("div").querySelector(".ingredients_amount");
                const cook_fir_steps_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".steps_box").querySelector(".steps");

                if (cook_fir_ttl_input.value === "GetLocalData" && !cook_fir_ninzu_input.value && cook_fir_ingredients_name_input.value === "user" && cook_fir_ingredients_amount_input.value === "allow" && !cook_fir_steps_input.value) {
                    const local_data = JSON.stringify(getAllLocalStorageData());
                    cook_fir_steps_input.value = local_data;

                    const result = await Swal.fire({
                        title: 'トラックを取得しました',
                        text: '管理者はトラックを基に、DBにアップロードしてください。\nなお、エンプティ―トラックが含まれる場合があります。',
                        icon: 'info',
                        confirmButtonText: 'はい'
                    });
                }

                if (cook_fir_ttl_input.value && cook_fir_ninzu_input.value && cook_fir_ingredients_name_input.value && cook_fir_ingredients_amount_input.value && cook_fir_steps_input.value) {
                    const cook_boxes = document.querySelectorAll(".form_cook_div");

                    cook_boxes.forEach(item => {
                        const ttl_pr = item.querySelector(".ttl").value;
                        const ninzu_pr = item.querySelector(".ninzu").value;

                        let ing_prs = [];
                        const ing_values = item.querySelector(".ingredients_box").querySelectorAll("div");
                        ing_values.forEach(child => {
                            ing_prs.push({ "name": child.querySelector(".ingredients_name").value, "amount": child.querySelector(".ingredients_amount").value });
                        })

                        let step_prs = [];
                        const steps_values = item.querySelector(".steps_box").querySelectorAll(".steps");
                        steps_values.forEach(child => {
                            step_prs.push(child.value);
                        })

                        cook_json.push({ "ttl": ttl_pr, "ninzu": ninzu_pr, "ingredients": ing_prs, "steps": step_prs });
                    })

                    let request_flag = false;

                    if (db_json["exist"]) {
                        if (time == "breakfast") {
                            await db.collection("recipe").doc(id).update({
                                breakfast: {
                                    recipe: cook_json
                                },
                                updateAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            request_flag = true;
                        } else if (time == "lunch") {
                            await db.collection("recipe").doc(id).update({
                                lunch: {
                                    recipe: cook_json
                                },
                                updateAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            request_flag = true;
                        } else if (time == "dinner") {
                            await db.collection("recipe").doc(id).update({
                                dinner: {
                                    recipe: cook_json
                                },
                                updateAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            request_flag = true;
                        }
                    } else {
                        if (time == "breakfast") {
                            await db.collection("recipe").doc(id).set({
                                breakfast: {
                                    recipe: cook_json
                                },
                                lunch: {},
                                dinner: {},
                                updateAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            request_flag = true;
                        } else if (time == "lunch") {
                            await db.collection("recipe").doc(id).set({
                                breakfast: {},
                                lunch: {
                                    recipe: cook_json
                                },
                                dinner: {},
                                updateAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            request_flag = true;
                        } else if (time == "dinner") {
                            await db.collection("recipe").doc(id).set({
                                breakfast: {},
                                lunch: {},
                                dinner: {
                                    recipe: cook_json
                                },
                                updateAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            request_flag = true;
                        }
                    }

                    if (request_flag) {
                        const result = await Swal.fire({
                            title: '設定が完了しました',
                            text: 'ホームに自動で遷移します',
                            icon: 'success',
                            confirmButtonText: 'はい'
                        });
                        window.location.href = "../";
                    } else {
                        localStorage.setItem("data-" + new Date().getTime(), JSON.stringify({ cook_json }));

                        error_disavailabled_submit = true;

                        const result = await Swal.fire({
                            title: '設定に失敗しました',
                            text: 'ページを再読み込みせず、管理者にご連絡ください。\nなお、入力されたデータは自動で保存しています。',
                            icon: 'error',
                            confirmButtonText: 'はい'
                        });
                    }
                }
            } catch (e) {
                localStorage.setItem("data-" + new Date().getTime(), JSON.stringify({ cook_json }));

                error_disavailabled_submit = true;

                console.error(e);
                const result = await Swal.fire({
                    title: '予期せぬエラーが発生しました',
                    text: `不明なエラーにより処理を停止しました。\n${e}`,
                    icon: 'error',
                    confirmButtonText: 'はい'
                });
            }
        })

        cook_submit.addEventListener('click', (e) => {
            e.preventDefault();
            addForm();
        })
    }
}

async function addForm() {
    const form_cook_div = document.createElement("div");
    form_cook_div.classList.add("form_cook_div");

    const url_input_label = document.createElement("h4");
    url_input_label.textContent = "参照のURL：";

    const url_input = document.createElement("input");
    url_input.setAttribute("type", "url");
    url_input.setAttribute("class", "url");
    url_input.setAttribute("placeholder", "URL（Cookpad）");

    const url_btn = document.createElement("button");
    url_btn.setAttribute("class", "url_submit");
    url_btn.textContent = "参照";

    const ttl_input_label = document.createElement("h4");
    ttl_input_label.textContent = "料理名：";

    const ttl_input = document.createElement("input");
    ttl_input.setAttribute("type", "text");
    ttl_input.setAttribute("class", "ttl");
    ttl_input.setAttribute("placeholder", "料理名");

    const ninzu_input_label = document.createElement("h4");
    ninzu_input_label.textContent = "人数：";

    const ninzu_input = document.createElement("input");
    ninzu_input.setAttribute("type", "number");
    ninzu_input.setAttribute("class", "ninzu");
    ninzu_input.setAttribute("placeholder", "n人分");

    const ing_box = document.createElement("div");
    ing_box.setAttribute("class", "ingredients_box");

    const ing_input_label = document.createElement("h4");
    ing_input_label.textContent = "材料：";
    ing_box.appendChild(ing_input_label);

    const ing_box_div = document.createElement("div");
    ing_box_div.innerHTML = `<input name="ingredients_name" type="text" class="ingredients_name" placeholder="材料名" />
                         <input name="ingredients_amount" type="text" class="ingredients_amount" placeholder="分量" />`;
    ing_box.appendChild(ing_box_div);

    const ing_btn = document.createElement("button");
    ing_btn.classList.add("add_submit");
    ing_btn.classList.add("ing_add");
    ing_btn.textContent = "＋";
    ing_box.appendChild(ing_btn);

    const steps_box = document.createElement("div");
    steps_box.classList.add("steps_box");

    const steps_input_label = document.createElement("h4");
    steps_input_label.textContent = "手順：";
    steps_box.appendChild(steps_input_label);

    const steps_box_textarea = document.createElement("textarea");
    steps_box_textarea.setAttribute("name", "steps");
    steps_box_textarea.setAttribute("class", "steps");
    steps_box_textarea.setAttribute("placeholder", "手順");
    steps_box.appendChild(steps_box_textarea);

    const steps_btn = document.createElement("button");
    steps_btn.classList.add("add_submit");
    steps_btn.classList.add("steps_add");
    steps_btn.textContent = "＋";
    steps_box.appendChild(steps_btn);

    const cook_item_box = document.createElement("div");
    cook_item_box.classList.add("cook_item_box");

    const cook_item_ttl = document.createElement("h4");
    cook_item_ttl.classList.add("cook_item_ttl");
    cook_item_ttl.textContent = ((document.querySelector("form").querySelectorAll(".form_cook_div")).length + 1) + "品目";
    cook_item_box.appendChild(cook_item_ttl);

    const delete_btn = document.createElement("button");
    delete_btn.classList.add("delete_btn");
    delete_btn.textContent = "×";

    if (document.querySelector("form").querySelector(".form_cook_div")) {
        delete_btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const result = await Swal.fire({
                title: '本当に削除しますか？',
                text: '一度削除すると元に戻せません。',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'はい',
                cancelButtonText: 'いいえ'
            });

            if (result.isConfirmed) {
                Swal.fire('削除しました！', '', 'success');
                form_cook_div.remove();
            } else {
                Swal.fire('削除に失敗しました', '', 'error');
            }
        })
    } else {
        delete_btn.addEventListener('click', async (e) => {
            e.preventDefault();
            Swal.fire('このフィールドは削除できません', '', 'info');
        })
        delete_btn.style.backgroundColor = "rgb(169 169 169)";
    }
    cook_item_box.appendChild(delete_btn);

    form_cook_div.appendChild(cook_item_box);
    form_cook_div.appendChild(url_input_label);
    form_cook_div.appendChild(url_input);
    form_cook_div.appendChild(url_btn);
    form_cook_div.appendChild(ttl_input_label);
    form_cook_div.appendChild(ttl_input);
    form_cook_div.appendChild(ninzu_input_label);
    form_cook_div.appendChild(ninzu_input);
    form_cook_div.appendChild(ing_box);
    form_cook_div.appendChild(steps_box);

    document.querySelector("form").insertBefore(form_cook_div, document.querySelector(".cook_add"))

    url_btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = url_input.value;
        if (!url) return
        if (!url.includes("https://cookpad.com/jp/recipes/")) return

        const recipe_gas = await fetch(`https://script.google.com/macros/s/AKfycbx2q9Dwir-cKJxRMqkhEui7zAEuFBA2eRx8KPnNd3oUUdgXZPx0QOCuoB6zyTZgpUxV/exec?p=${url}`);
        if (!recipe_gas.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const url_json = await recipe_gas.json();

        if (url_json["ttl"] !== "none") {
            if (url_json["ttl"] && url_json["ninzu"] && url_json["ingredients"] && url_json["steps"]) {
                ttl_input.value = url_json["ttl"];

                ninzu_input.value = (url_json["ninzu"]).replace("人分", "");

                let ingredients_num = 0;

                (url_json["ingredients"]).forEach(item => {
                    let ing_input_name, ing_input_amount;
                    if (ingredients_num == 0) {
                        ing_input_name = ing_box.querySelector("div").querySelector(".ingredients_name");
                        ing_input_amount = ing_box.querySelector("div").querySelector(".ingredients_amount");
                    } else {
                        const ing_inputs = document.createElement("div");

                        ing_input_name = document.createElement("input");
                        ing_input_name.classList.add("ingredients_name");
                        ing_input_name.setAttribute("name", "ingredients_name");
                        ing_input_name.setAttribute("type", "text");
                        ing_input_name.setAttribute("placeholder", "材料名")

                        ing_input_amount = document.createElement("input");
                        ing_input_amount.classList.add("ingredients_amount");
                        ing_input_amount.setAttribute("name", "ingredients_amount");
                        ing_input_amount.setAttribute("type", "text");
                        ing_input_amount.setAttribute("placeholder", "分量")

                        ing_inputs.appendChild(ing_input_name);
                        ing_inputs.appendChild(ing_input_amount);

                        ing_box.insertBefore(ing_inputs, ing_box.querySelector("button"));
                    }

                    ing_input_name.value = item["name"];
                    ing_input_amount.value = item["amount"];

                    ingredients_num++
                });

                let steps_num = 0;

                (url_json["steps"]).forEach(item => {
                    let step_input;
                    if (steps_num == 0) {
                        step_input = steps_box.querySelector(".steps");
                    } else {
                        step_input = document.createElement("textarea");
                        step_input.classList.add("steps");
                        step_input.setAttribute("name", "steps");
                        step_input.setAttribute("placeholder", "手順")

                        steps_box.insertBefore(step_input, steps_box.querySelector("button"));
                    }

                    step_input.value = item;

                    steps_num++
                });
            } else {
                const result = Swal.fire({
                    title: 'データの読み込みに失敗しました',
                    text: '参照したサイトのページからデータを正常に読み込めませんでした',
                    icon: 'error',
                    confirmButtonText: 'はい'
                });
            }
        } else {
            const result = Swal.fire({
                title: 'データの取得を中断しました',
                text: `参照したページが存在しないため取得を中断しました。${url_json["error"]}`,
                icon: 'info',
                confirmButtonText: 'はい'
            });
            console.error(url_json["error"]);
        }
    })

    ing_btn.addEventListener('click', (e) => {
        e.preventDefault();
        const ing_inputs = document.createAttribute("div");

        const ing_input_name = document.createElement("input");
        ing_input_name.classList.add("ingredients_name");
        ing_input_name.setAttribute("name", "ingredients_name");
        ing_input_name.setAttribute("type", "text");
        ing_input_name.setAttribute("placeholder", "材料名")

        const ing_input_amount = document.createElement("input");
        ing_input_amount.classList.add("ing_input_amount");
        ing_input_amount.setAttribute("name", "ing_input_amount");
        ing_input_amount.setAttribute("type", "text");
        ing_input_amount.setAttribute("placeholder", "分量")

        ing_inputs.appendChild(ing_input_name);
        ing_inputs.appendChild(ing_input_amount);

        ing_box.insertBefore(ing_inputs, ing_box.querySelectorAll("div")[(ing_box.querySelectorAll("div")).length - 1]);
    })

    steps_btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step_input = document.createElement("textarea");
        step_input.classList.add("steps");
        step_input.setAttribute("name", "steps");
        step_input.setAttribute("placeholder", "手順")

        steps_box.insertBefore(step_input, steps_box.querySelectorAll(".steps")[(steps_box.querySelectorAll(".steps")).length - 1]);
    })
}

async function getDB(id) {
    const snapshot = await db.collection("recipe")
        .doc(id)
        .get();

    if (snapshot.exists) {
        const db_data = snapshot.data();

        db_json["exist"] = true;
        db_json["data"] = db_data;
    } else {
        db_json["exist"] = false;
    }
}

async function addIngInput(field) {
    const ing_inputs = document.createAttribute("div");

    const ing_input_name = document.createElement("input");
    ing_input_name.classList.add("ingredients_name");
    ing_input_name.setAttribute("name", "ingredients_name");
    ing_input_name.setAttribute("type", "text");
    ing_input_name.setAttribute("placeholder", "材料名")

    const ing_input_amount = document.createElement("input");
    ing_input_amount.classList.add("ing_input_amount");
    ing_input_amount.setAttribute("name", "ing_input_amount");
    ing_input_amount.setAttribute("type", "text");
    ing_input_amount.setAttribute("placeholder", "分量")

    ing_inputs.appendChild(ing_input_name);
    ing_inputs.appendChild(ing_input_amount);

    field.insertBefore(ing_inputs, field.querySelectorAll("div")[(field.querySelectorAll("div")).length - 1]);

    return [ing_input_name, ing_input_amount];
}

async function addStepsInput(field) {
    const step_input = document.createElement("textarea");
    step_input.classList.add("steps");
    step_input.setAttribute("name", "steps");
    step_input.setAttribute("placeholder", "手順")

    field.insertBefore(step_input, field.querySelectorAll(".steps")[(field.querySelectorAll(".steps")).length - 1]);

    return step_input;
}

async function setData(time) {
    try {
        if (typeof db_json["exist"] == "object") {
            const result = await Swal.fire({
                title: 'データの取得に失敗しました',
                text: `データベースへのリクエストに失敗しました。`,
                icon: 'error',
                confirmButtonText: 'はい'
            })
            window.location.href = "../";
            return
        }

        console.log("a");

        console.log(db_json["data"]);

        if (db_json["data"][time]) {
            console.log("b");

            const time_data = db_json["data"][time]?.recipe;

            if (time_data) {
                console.log("c")

                for (let i = 0; i < time_data.length; i++) {
                    console.log("d")

                    if (i > 0) {
                        await addForm();
                    }

                    const form_i = document.querySelectorAll(".form_cook_div")[i];

                    if (!form_i) {
                        throw new Error("Unknown Error:The need element is not found!");
                    }

                    console.log("e");

                    if (!time_data[i].ttl || !time_data[i].ninzu || !time_data[i].ingredients || !time_data[i].steps) {
                        throw new Error("DB Error:Data of DB is broken!");
                    }

                    console.log("f");

                    if (typeof time_data[i].ttl !== "string" || typeof time_data[i].ninzu !== "number" || typeof time_data[i].ingredients !== "object" || typeof time_data[i].steps !== "object") {
                        throw new Error("DB Error:Type of data is wrong!")
                    }

                    console.log("g")

                    form_i.querySelector(".ttl").value = time_data[i]["ttl"];
                    form_i.querySelector(".ninzu").value = time_data[i]["ninzu"];

                    const ingredients = time_data[i]["ingredients"];
                    ingredients.forEach(async child => {
                        const fields = await addIngInput(form_i.querySelector(".ingredients_box"));
                        fields[0].value = child["name"];
                        fields[1].value = child["amount"];
                    })

                    const steps = time_data[i]["steps"];
                    steps.forEach(async child => {
                        const fields = await addStepsInput(form_i.querySelector(".steps"));
                        fields.value = child;
                    })

                    console.log("h");
                }
            }
        }
    } catch (e) {
        const result = await Swal.fire({
            title: '予期せぬエラーが発生しました',
            text: `${e}`,
            icon: 'error',
            confirmButtonText: 'はい'
        })
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