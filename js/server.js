var isRun = false;
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
                        Swal.fire({
                            icon: 'error',
                            position: 'top-end',
                            toast: true,
                            title: 'CONECTION OF SERVER IS LOST',
                            text: 'サーバーとの接続をロスしました。',
                        })
                        if (user_data["status"] == "admin") {
                            Swal.fire({
                                icon: 'info',
                                position: 'top-end',
                                toast: true,
                                title: 'SERVER STATUS : STOP',
                                text: 'アドミン権限で停止しているサーバーに接続しています。',
                            })
                            if (!isRun) {
                                isRun = true;
                                Main();
                            }
                            return
                        }
                        window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
                        isRedirect = true;
                    } else if (!isRun) {
                        Main();
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
                }
                isRun = true;
            })
    } else {
        window.location.href = "https://saigaikinkyuu.github.io/recipe_site/login/";

        window.body = "";
        document.body.addEventListener('click', () => {
            window.location.href = "https://saigaikinkyuu.github.io/recipe_site/login/";
        })
    }
})