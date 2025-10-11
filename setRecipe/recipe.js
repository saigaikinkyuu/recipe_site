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

async function Main() {
    const id = getParam("id");
    const time = getParam("time");

    if (!id || !time) {
        window.location.href = "../";
    } else {
        document.querySelector("form").innerHTML = `<button class="add_submit cook_add">＋</button><button id="submit">送信</button>`;
        getDB(id);
        addForm();

        const ttl = document.querySelector("h3");
        const cook_submit = document.querySelector(".cook_add");
        /*const url_input = document.querySelector("#url");
        const url_btn = document.querySelector("#url_submit");
        const ttl_input = document.querySelector("#ttl");
        const ninzu_input = document.querySelector("#ninzu");
        const ing_box = document.querySelector("#ingradients_box");
        const ing_btn = document.querySelector("#ing_add");
        const steps_box = document.querySelector("#steps_box");
        const steps_btn = document.querySelector("#steps_add");*/
        const submit = document.querySelector("#submit");

        ttl.textContent = `${id.slice(0, 4)}年${id.slice(4, 6)}月${id.slice(6, 8)}日－${time}`;

        /*url_btn.addEventListener('click', () => {
            const url = url_input.value;
            if (!url) return
            if (!url.includes("https://cookpad.com/jp/recipes/")) return

            const recipe_gas = await fetch(`https://script.google.com/macros/s/AKfycbx2q9Dwir-cKJxRMqkhEui7zAEuFBA2eRx8KPnNd3oUUdgXZPx0QOCuoB6zyTZgpUxV/exec?p=${url}`);
            if (!recipe_gas.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const url_json = await recipe_gas.json();

            if (url_json["ttl"] !== "none") {
                if (url_json["ttl"] && url_json["ninzu"] && url_json["ingrants"] && url_json["steps"]) {
                    ttl_input.value = url_json["ttl"];

                    ninzu_input.value = (url_input["ninzu"]).replace("人前", "");

                    let ingrants_num = 0;

                    (url_json["ingrants"]).forEach(item => {
                        let ing_input_name, ing_input_amount;
                        if (ingrants_num == 0) {
                            ing_input_name = ing_box.querySelector("div").querySelector(".ingradients_name");
                            ing_input_amount = ing_box.querySelector("div").querySelector(".ingradients_amount");
                        } else {
                            const ing_inputs = document.createAttribute("div");

                            ing_input_name = document.createElement("input");
                            ing_input_name.classList.add("ingradients_name");
                            ing_input_name.setAttribute("name", "ingradients_name");
                            ing_input_name.setAttribute("type", "text");
                            ing_input_name.setAttribute("placeholder", "材料名")

                            ing_input_amount = document.createElement("input");
                            ing_input_amount.classList.add("ing_input_amount");
                            ing_input_amount.setAttribute("name", "ing_input_amount");
                            ing_input_amount.setAttribute("type", "text");
                            ing_input_amount.setAttribute("placeholder", "分量")

                            ing_inputs.appendChild(ing_input_name);
                            ing_inputs.appendChild(ing_input_amount);

                            ing_box.insertBefore(ing_inputs, ing_box.querySelectorAll("div")[(ing_box.querySelectorAll("div")).length - 1]);
                        }

                        ing_input_name.value = item["name"];
                        ing_input_amount.value = item["amount"];

                        ingrants_num++
                    });

                    let steps_num = 0;

                    (url_json["steps"]).forEach(item => {
                        let step_input;
                        if (steps_num == 0) {
                            step_input = steps_box.querySelector("steps");
                        } else {
                            step_input = document.createElement("textarea");
                            step_input.classList.add("steps");
                            step_input.setAttribute("name", "steps");
                            step_input.setAttribute("placeholder", "手順")

                            steps_box.insertBefore(step_input, steps_box.querySelectorAll(".steps")[(steps_box.querySelectorAll(".steps")).length - 1]);
                        }

                        step_input.value = item;

                        steps_num++
                    });
                } else {
                    alert(`FAILED FETCH EXCHANGE.`);
                }
            } else {
                alert(`FAILED FETCH FUNCTION.${url_json["error"]}`);
                console.error(url_json["error"]);
            }
        })

        ing_btn.addEventListener('click', () => {
            const ing_inputs = document.createAttribute("div");

            const ing_input_name = document.createElement("input");
            ing_input_name.classList.add("ingradients_name");
            ing_input_name.setAttribute("name", "ingradients_name");
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

        steps_btn.addEventListener('click', () => {
            const step_input = document.createElement("textarea");
            step_input.classList.add("steps");
            step_input.setAttribute("name", "steps");
            step_input.setAttribute("placeholder", "手順")

            steps_box.insertBefore(step_input, steps_box.querySelectorAll(".steps")[(steps_box.querySelectorAll(".steps")).length - 1]);
        })*/

        submit.addEventListener('click', async (e) => {
            const cook_json = [];
            try {
                e.preventDefault();
                if(error_disavailabled_submit){
                    alert("実行中の予期せぬエラーにより処理を停止しました。")
                    return
                }

                const cook_fir_ttl_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".ttl");
                const cook_fir_ninzu_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".ninzu");
                const cook_fir_ingradients_name_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".ingradients_box").querySelector("div").querySelector(".ingradients_name");
                const cook_fir_ingradients_amount_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".ingradients_box").querySelector("div").querySelector(".ingradients_amount");
                const cook_fir_steps_input = document.querySelectorAll(".form_cook_div")[0].querySelector(".steps_box").querySelector(".steps");

                if (cook_fir_ttl_input.value && cook_fir_ninzu_input.value && cook_fir_ingradients_name_input.value && cook_fir_ingradients_amount_input.value && cook_fir_steps_input.value) {
                    const cook_boxes = document.querySelectorAll(".form_cook_div");

                    cook_boxes.forEach(item => {
                        const ttl_pr = item.querySelector(".ttl").value;
                        const ninzu_pr = item.querySelector(".ninzu").value;

                        let ing_prs = [];
                        const ing_values = item.querySelector(".ingredients").querySelectorAll("div");
                        ing_values.forEach(child => {
                            ing_prs.push({ "name": child.querySelector(".ingradients_name").value, "amount": child.querySelector(".ingradients_amount").value });
                        })

                        let step_prs = [];
                        const steps_values = item.querySelector(".steps_box").querySelectorAll(".steps");
                        steps_values.forEach(child => {
                            step_prs.push(child.value);
                        })

                        cook_json.push({ "ttl": ttl_pr, "ninzu": ninzu_pr, "ingredients": ing_prs, "steps": step_prs });
                    })
                    /*
                    const ttl_pr = ttl_input.value;
                    const ninzu_pr = ninzu_input.value;
    
                    let ing_prs = [];
    
                    const ing_values = ing_box.querySelectorAll("div");
                    ing_values.forEach(item => {
                        ing_prs.push({ "name": item.querySelector(".ingradients_name").value, "amount": item.querySelector(".ingradients_amount").value });
                    })
    
                    let step_prs = [];
    
                    const steps_values = steps_box.querySelectorAll(".steps");
                    steps_values.forEach(item => {
                        step_prs.push(item.value);
                    })
                    */
                    
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

                    if(request_flag){
                        alert("設定が完了しました。\nホームに自動で遷移します。");
                        window.location.href = "../";
                    }else {
                        const fail_data = localStorage.getItem("data");
                        fail_data.push(cook_json);
                        localStorage.setItem("data", fail_data);

                        error_disavailabled_submit = true;

                        alert("YOUR REQUEST IS FAILED.\nPLEASE TELL THE SITE MANAGER ABOUT THIS IMMIDIATELY.");
                        alert("ページをリロードせずに管理者に連絡ください。");
                    }
                }
            } catch (e) {
                const fail_data = localStorage.getItem("data")?localStorage.getItem("data") : [];
                fail_data.push(cook_json);
                localStorage.setItem("data", fail_data);

                error_disavailabled_submit = true;

                console.error(e);
                alert(`SUBMIT REQUEST WAS REJECTED.\nDETAIL:${e}`);
            }
        })

        cook_submit.addEventListener('click' , (e) => {
            e.preventDefault();
            addForm();
        })
    }
}

async function addForm() {
    const form_cook_div = document.createElement("div");
    form_cook_div.classList.add("form_cook_div");

    const url_input = document.createElement("input");
    url_input.setAttribute("type", "url");
    url_input.setAttribute("class", "url");
    url_input.setAttribute("placeholder", "URL（Cookpad）");

    const url_btn = document.createElement("button");
    url_btn.setAttribute("class", "url_submit");
    url_btn.textContent = "参照";

    const ttl_input = document.createElement("input");
    ttl_input.setAttribute("type", "text");
    ttl_input.setAttribute("class", "ttl");
    ttl_input.setAttribute("placeholder", "料理名");

    const ninzu_input = document.createElement("input");
    ninzu_input.setAttribute("type", "number");
    ninzu_input.setAttribute("class", "ninzu");
    ninzu_input.setAttribute("placeholder", "n人前");

    const ing_box = document.createElement("div");
    ing_box.setAttribute("class", "ingradients_box");

    const ing_box_div = document.createElement("div");
    ing_box_div.innerHTML = `<input name="ingradients_name" type="text" class="ingradients_name" placeholder="材料名" />
                         <input name="ingradients_amount" type="text" class="ingradients_amount" placeholder="分量" />`;
    ing_box.appendChild(ing_box_div);

    const ing_btn = document.createElement("button");
    ing_btn.classList.add("add_submit");
    ing_btn.classList.add("ing_add");
    ing_btn.textContent = "＋";
    ing_box.appendChild(ing_btn);

    const steps_box = document.createElement("div");
    steps_box.classList.add("steps_box");

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

    form_cook_div.appendChild(url_input, document.querySelector(".cook_add"));
    form_cook_div.appendChild(url_btn, document.querySelector(".cook_add"));
    form_cook_div.appendChild(ttl_input, document.querySelector(".cook_add"));
    form_cook_div.appendChild(ninzu_input, document.querySelector(".cook_add"));
    form_cook_div.appendChild(ing_box, document.querySelector(".cook_add"));
    form_cook_div.appendChild(steps_box, document.querySelector(".cook_add"));

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
            if (url_json["ttl"] && url_json["ninzu"] && url_json["ingrants"] && url_json["steps"]) {
                ttl_input.value = url_json["ttl"];

                ninzu_input.value = (url_input["ninzu"]).replace("人前", "");

                let ingrants_num = 0;

                (url_json["ingrants"]).forEach(item => {
                    let ing_input_name, ing_input_amount;
                    if (ingrants_num == 0) {
                        ing_input_name = ing_box.querySelector("div").querySelector(".ingradients_name");
                        ing_input_amount = ing_box.querySelector("div").querySelector(".ingradients_amount");
                    } else {
                        const ing_inputs = document.createAttribute("div");

                        ing_input_name = document.createElement("input");
                        ing_input_name.classList.add("ingradients_name");
                        ing_input_name.setAttribute("name", "ingradients_name");
                        ing_input_name.setAttribute("type", "text");
                        ing_input_name.setAttribute("placeholder", "材料名")

                        ing_input_amount = document.createElement("input");
                        ing_input_amount.classList.add("ing_input_amount");
                        ing_input_amount.setAttribute("name", "ing_input_amount");
                        ing_input_amount.setAttribute("type", "text");
                        ing_input_amount.setAttribute("placeholder", "分量")

                        ing_inputs.appendChild(ing_input_name);
                        ing_inputs.appendChild(ing_input_amount);

                        ing_box.insertBefore(ing_inputs, ing_box.querySelectorAll("div")[(ing_box.querySelectorAll("div")).length - 1]);
                    }

                    ing_input_name.value = item["name"];
                    ing_input_amount.value = item["amount"];

                    ingrants_num++
                });

                let steps_num = 0;

                (url_json["steps"]).forEach(item => {
                    let step_input;
                    if (steps_num == 0) {
                        step_input = steps_box.querySelector("steps");
                    } else {
                        step_input = document.createElement("textarea");
                        step_input.classList.add("steps");
                        step_input.setAttribute("name", "steps");
                        step_input.setAttribute("placeholder", "手順")

                        steps_box.insertBefore(step_input, steps_box.querySelectorAll(".steps")[(steps_box.querySelectorAll(".steps")).length - 1]);
                    }

                    step_input.value = item;

                    steps_num++
                });
            } else {
                alert(`FAILED FETCH EXCHANGE.`);
            }
        } else {
            alert(`FAILED FETCH FUNCTION.${url_json["error"]}`);
            console.error(url_json["error"]);
        }
    })

    ing_btn.addEventListener('click', (e) => {
        e.preventDefault();
        const ing_inputs = document.createAttribute("div");

        const ing_input_name = document.createElement("input");
        ing_input_name.classList.add("ingradients_name");
        ing_input_name.setAttribute("name", "ingradients_name");
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

function getDB(id) {
    const unsubscribe = db.collection("recipe")
        .doc(id)
        .onSnapshot((snapshot) => {
            if (snapshot.exists) {
                const db_data = snapshot.data();

                db_json["exist"] = true;
                db_json["data"] = db_data;
            } else {
                db_json["exist"] = false;
            }
        })
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