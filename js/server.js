auth.onAuthStateChanged(user => {
    if (user) {
        const unsubscribe = db.collection("server")
            .doc("db")
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    const db_data = snapshot.data();

                    let isRedirect = false;

                    if (db_data["status"] == "stop") {
                        window.location.href = "../error/";
                        isRedirect = true;
                    }else {
                        Main();
                    }

                    if(isRedirect){
                        const iframe = document.createElement("iframe");
                        iframe.href = "../error/";

                        document.body.appendChild(iframe);
                        document.title = "Error";

                        document.body.addEventListener('click' , () => {
                            window.location.href = "../error/";
                        })
                    }
                }
            })
    } else {
        window.location.href = "../login/";

        window.body = "";
        document.body.addEventListener('click' , () => {
            window.location.href = "../login/";
        })
    }
})