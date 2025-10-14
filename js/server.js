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
                        if(user_data["status"] == "admin"){
                            Main();
                            return
                        }
                        window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
                        isRedirect = true;
                    }else {
                        Main();
                    }

                    if(isRedirect){
                        const iframe = document.createElement("iframe");
                        iframe.href = "https://saigaikinkyuu.github.io/recipe_site/error/";

                        document.body.appendChild(iframe);
                        document.title = "Error";

                        document.body.addEventListener('click' , () => {
                            window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
                        })
                    }
                }
            })
    } else {
        window.location.href = "https://saigaikinkyuu.github.io/recipe_site/login/";

        window.body = "";
        document.body.addEventListener('click' , () => {
            window.location.href = "https://saigaikinkyuu.github.io/recipe_site/login/";
        })
    }
})