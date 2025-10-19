(async () => {
    try {
        const data = await callapi('get', {
            collection: 'server',
            doc: 'db'
        })

        if (data["status"] == "stop") {
            document.querySelector(".container").querySelector("p").innerText = data["mes"];
        } else {
            window.location.href = "../";
        }
    } catch (e) {
        console.error(e);
        window.location.href = "../login";
    }
})

async function callapi(action, body) {
    const idToken = await firebase.auth().currentUser.getIdToken();

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