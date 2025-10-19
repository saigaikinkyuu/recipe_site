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
                            await callapi('update', {
                                collection: 'recipe',
                                doc: id,
                                data: {
                                    breakfast: {
                                        recipe: cook_json
                                    }
                                }
                            })
                            request_flag = true;
                        } else if (time == "lunch") {
                            await callapi('update', {
                                collection: 'recipe',
                                doc: id,
                                data: {
                                    lunch: {
                                        recipe: cook_json
                                    }
                                }
                            })
                            request_flag = true;
                        } else if (time == "dinner") {
                            await callapi('update', {
                                collection: 'recipe',
                                doc: id,
                                data: {
                                    dinner: {
                                        recipe: cook_json
                                    }
                                }
                            })
                            request_flag = true;
                        }
                    } else {
                        if (time == "breakfast") {
                            await callapi('create', {
                                collection: 'recipe',
                                doc: id,
                                data: {
                                    breakfast: {
                                        recipe: cook_json
                                    },
                                    lunch: {},
                                    dinner: {}
                                }
                            })
                            request_flag = true;
                        } else if (time == "lunch") {
                            await callapi('create', {
                                collection: 'recipe',
                                doc: id,
                                data: {
                                    breakfast: {},
                                    lunch: {
                                        recipe: cook_json
                                    },
                                    dinner: {}
                                }
                            })
                            request_flag = true;
                        } else if (time == "dinner") {
                            await callapi('create', {
                                collection: 'recipe',
                                doc: id,
                                data: {
                                    breakfast: {},
                                    lunch: {},
                                    dinner: {
                                        recipe: cook_json
                                    }
                                }
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

    const step_box = document.createElement("div");
    step_box.classList.add("step_txtarea_box");

    const steps_box_textarea = document.createElement("textarea");
    steps_box_textarea.setAttribute("name", "steps");
    steps_box_textarea.setAttribute("class", "steps");
    steps_box_textarea.setAttribute("placeholder", "手順");
    step_box.appendChild(steps_box_textarea);

    steps_box.appendChild(step_box);

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

                let isNum_ninzu = false;

                if (Number((url_json["ninzu"]).replace("人分", ""))) {
                    isNum_ninzu = true;
                }

                if (isNum_ninzu) {
                    ninzu_input.value = Number((url_json["ninzu"]).replace("人分", ""));
                } else {
                    ninzu_input.value = 0;
                }

                let ingredients_num = 0;

                (url_json["ingredients"]).forEach(item => {
                    let ing_input_name, ing_input_amount, ing_submit;
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
                        ing_input_amount.setAttribute("placeholder", "分量");

                        ing_submit = document.createElement("button");
                        ing_submit.classList.add("remove_cont");
                        ing_submit.textContent = "×";

                        ing_inputs.appendChild(ing_input_name);
                        ing_inputs.appendChild(ing_input_amount);
                        ing_inputs.appendChild(ing_submit);

                        ing_box.insertBefore(ing_inputs, ing_box.querySelector(".ing_add"));

                        ing_submit.addEventListener('click', (e) => {
                            e.preventDefault();
                            ing_inputs.remove();
                        })
                    }

                    ing_input_name.value = item["name"];

                    if (item["amount"]) {
                        ing_input_amount.value = item["amount"];
                    } else {
                        ing_input_amount.value = "適量(不明)";
                    }

                    ingredients_num++
                });

                let steps_num = 0;

                (url_json["steps"]).forEach(item => {
                    let step_box, step_input, step_submit_box, step_submit;
                    if (steps_num == 0) {
                        step_input = steps_box.querySelector(".steps");
                    } else {
                        step_box = document.createElement("div");
                        step_box.classList.add("step_txtarea_box");

                        step_input = document.createElement("textarea");
                        step_input.classList.add("steps");
                        step_input.setAttribute("name", "steps");
                        step_input.setAttribute("placeholder", "手順")

                        step_submit_box = document.createElement("div");
                        step_submit_box.classList.add("step_submit_box");

                        step_submit = document.createElement("button");
                        step_submit.classList.add("remove_cont");
                        step_submit.textContent = "×";

                        step_submit_box.appendChild(step_submit);

                        step_box.appendChild(step_input);
                        step_box.appendChild(step_submit_box);

                        steps_box.insertBefore(step_box, steps_box.querySelector(".steps_add"));

                        step_submit.addEventListener('click', (e) => {
                            e.preventDefault();
                            step_box.remove();
                        })
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
        const ing_inputs = document.createElement("div");

        const ing_input_name = document.createElement("input");
        ing_input_name.classList.add("ingredients_name");
        ing_input_name.setAttribute("name", "ingredients_name");
        ing_input_name.setAttribute("type", "text");
        ing_input_name.setAttribute("placeholder", "材料名")

        const ing_input_amount = document.createElement("input");
        ing_input_amount.classList.add("ingredients_amount");
        ing_input_amount.setAttribute("name", "ingredients_amount");
        ing_input_amount.setAttribute("type", "text");
        ing_input_amount.setAttribute("placeholder", "分量");

        const ing_submit = document.createElement("button");
        ing_submit.classList.add("remove_cont");
        ing_submit.textContent = "×";

        ing_inputs.appendChild(ing_input_name);
        ing_inputs.appendChild(ing_input_amount);
        ing_inputs.appendChild(ing_submit);

        ing_box.insertBefore(ing_inputs, ing_box.querySelector(".ing_add"));

        ing_submit.addEventListener('click', (e) => {
            e.preventDefault();
            ing_inputs.remove();
        })
    })

    steps_btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step_box = document.createElement("div");
        step_box.classList.add("step_txtarea_box");

        const step_input = document.createElement("textarea");
        step_input.classList.add("steps");
        step_input.setAttribute("name", "steps");
        step_input.setAttribute("placeholder", "手順")

        const step_submit_box = document.createElement("div");
        step_submit_box.classList.add("step_submit_box");

        const step_submit = document.createElement("button");
        step_submit.classList.add("remove_cont");
        step_submit.textContent = "×";

        step_submit_box.appendChild(step_submit);

        step_box.appendChild(step_input);
        step_box.appendChild(step_submit_box);

        steps_box.insertBefore(step_box, steps_box.querySelector(".steps_add"));

        step_submit.addEventListener('click', (e) => {
            e.preventDefault();
            step_box.remove();
        })
    })
}

async function getDB(id) {
    const db_data = await callapi('get', {
        collection: 'recipe',
        doc: id
    })

    db_json["exist"] = true;
    db_json["data"] = db_data;
}

async function addIngInput(field) {
    const ing_inputs = document.createElement("div");

    const ing_input_name = document.createElement("input");
    ing_input_name.classList.add("ingredients_name");
    ing_input_name.setAttribute("name", "ingredients_name");
    ing_input_name.setAttribute("type", "text");
    ing_input_name.setAttribute("placeholder", "材料名")

    const ing_input_amount = document.createElement("input");
    ing_input_amount.classList.add("ingredients_amount");
    ing_input_amount.setAttribute("name", "ingredients_amount");
    ing_input_amount.setAttribute("type", "text");
    ing_input_amount.setAttribute("placeholder", "分量");

    const ing_submit = document.createElement("button");
    ing_submit.classList.add("remove_cont");
    ing_submit.textContent = "×";

    ing_inputs.appendChild(ing_input_name);
    ing_inputs.appendChild(ing_input_amount);
    ing_inputs.appendChild(ing_submit);

    field.insertBefore(ing_inputs, field.querySelector(".ing_add"));

    ing_submit.addEventListener('click', (e) => {
        e.preventDefault();
        ing_inputs.remove();
    })

    return [ing_input_name, ing_input_amount];
}

async function addStepsInput(field) {
    const step_box = document.createElement("div");
    step_box.classList.add("step_txtarea_box");

    const step_input = document.createElement("textarea");
    step_input.classList.add("steps");
    step_input.setAttribute("name", "steps");
    step_input.setAttribute("placeholder", "手順")

    const step_submit_box = document.createElement("div");
    step_submit_box.classList.add("step_submit_box");

    const step_submit = document.createElement("button");
    step_submit.classList.add("remove_cont");
    step_submit.textContent = "×";

    step_submit_box.appendChild(step_submit);

    step_box.appendChild(step_input);
    step_box.appendChild(step_submit_box);

    field.insertBefore(step_box, field.querySelector(".steps_add"));

    step_submit.addEventListener('click', (e) => {
        e.preventDefault();
        step_box.remove();
    })

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

        console.log(db_json["data"]);

        if (db_json["data"][time]) {
            const time_data = db_json["data"][time]?.recipe;

            if (time_data) {
                for (let i = 0; i < time_data.length; i++) {
                    if (i > 0) {
                        await addForm();
                    }

                    const form_i = document.querySelectorAll(".form_cook_div")[i];

                    if (!form_i) {
                        throw new Error("Unknown Error:The need element is not found!");
                    }

                    if (!time_data[i].ttl || !time_data[i].ninzu || !time_data[i].ingredients || !time_data[i].steps) {
                        throw new Error("DB Error:Data of DB is broken!");
                    }

                    if (typeof time_data[i].ttl !== "string" || typeof time_data[i].ninzu !== "string" || typeof time_data[i].ingredients !== "object" || typeof time_data[i].steps !== "object") {
                        throw new Error("DB Error:Type of data is wrong!")
                    }

                    form_i.querySelector(".ttl").value = time_data[i]["ttl"];
                    form_i.querySelector(".ninzu").value = time_data[i]["ninzu"];

                    const ingredients = time_data[i]["ingredients"];
                    let ingredients_num = 0;
                    ingredients.forEach(async child => {
                        let fields;

                        if (ingredients_num > 0) {
                            fields = await addIngInput(form_i.querySelector(".ingredients_box"));
                        } else {
                            fields = [];
                            fields.push(form_i.querySelector(".ingredients_box").querySelector("div").querySelector(".ingredients_name"));
                            fields.push(form_i.querySelector(".ingredients_box").querySelector("div").querySelector(".ingredients_amount"));
                        }

                        fields[0].value = child["name"];
                        fields[1].value = child["amount"];
                        ingredients_num++
                    })

                    const steps = time_data[i]["steps"];
                    let steps_num = 0;
                    steps.forEach(async child => {
                        let fields;
                        if (steps_num > 0) {
                            fields = await addStepsInput(form_i.querySelector(".steps_box"));
                        } else {
                            fields = form_i.querySelector(".steps_box").querySelector(".steps");
                        }
                        fields.value = child;
                        steps_num++;
                    })
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
    const database = await getUserData();
    const idToken = database.userId;

    if (!user) {
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