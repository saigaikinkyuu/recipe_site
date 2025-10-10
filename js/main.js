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

function Main(){
    const calender_container = document.querySelector(".calender");
    const last_date = monthLastDate(new Date());
    const month_first_day = monthFirstDay(new Date());
    const cell_number = (last_date + month_first_day) <= 28 ? 28 : 35;

    const calender_ttl = document.createElement("h2");
    calender_ttl.textContent = (new Date().getMonth() + 1) + "月";
    calender_ttl.classList.add("calender_ttl")

    calender_container.appendChild(calender_ttl);

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