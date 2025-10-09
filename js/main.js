document.onload = () => {
    const calender_container = document.querySelector(".calender");
    const last_date = monthLastDate(new Date());

    for(let i = 1;i <= last_date; i++){
        if((i % 7) == 0){
            const week_box = document.createElement("div");
            week_box.classList.add("week");
            week_box.dataset.wn = (i / 7);

            calender_container.appendChild(week_box);
        }

        const date_box = document.createElement("p");
        date_box.classList.add("date");
        date_box.textContent = i + "日";

        const belong_week_box = document.querySelector(".week[data-wn='" + ((i - (i % 7)) / 7) + "']");

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