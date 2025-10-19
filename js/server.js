var isRun = false;
(async () => {
    try {
        const db_data = await callapi('get', {
            collection: 'server',
            doc: 'db'
        })

        console.log(db_data);

        let isRedirect = false;

        if (db_data["status"] == "stop") {
            if (db_data["userStatus"] == "admin") {
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
            // window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
            isRedirect = true;
        } else if (!isRun) {
            Main();
        }

        if (isRedirect) {
            /*const iframe = document.createElement("iframe");
            iframe.href = "https://saigaikinkyuu.github.io/recipe_site/error/";

            document.body.appendChild(iframe);
            document.title = "Error";

            document.body.addEventListener('click', () => {
                window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
            })*/
        }
        isRun = true;
    } catch (e) {
        console.error(e);
        // window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
    }
})()