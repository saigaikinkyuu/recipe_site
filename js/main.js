window.onload = () => {
    const calender_container = document.querySelector(".calender");
    const last_date = monthLastDate(new Date());
    const month_first_day = monthFirstDay(new Date());
    const cell_number = (last_date + month_first_day) <= 28 ? 28 : 35;

    for(let i = 1; i <= cell_number; i++){
        let c = i - month_first_day;
        if(((i % 7) == 0 && i !== 0) || i == 1){
            const week_box = document.createElement("div");
            week_box.classList.add("week");
            if(i == (1 - month_first_day)){
                week_box.dataset.wn = "1";
            }else {
                week_box.dataset.wn = ((i / 7) + 1);
            }

            calender_container.appendChild(week_box);
        }

        const date_box = document.createElement("p");
        date_box.classList.add("date");
        if(c > 0 && c <= last_date){
            date_box.textContent = c + "日";
        }

        const belong_week_box = document.querySelector(".week[data-wn='" + (((i - (i % 7)) / 7) + 1) + "']");

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