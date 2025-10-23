export async function serverFunc() {
    try {
        async function callapi(action, body) {
            try {
                const user = firebase.auth().currentUser;
                if (action == 'get') {
                    const postDocRef = doc(db, body.collection, body.doc);

                    const docSnap = await getDoc(postDocRef);

                    if (docSnap.exists()) {
                        const postData = { id: docSnap.id, ...docSnap.data() };
                        return postData;
                    } else {
                        return 503;
                    }
                } else if (action == 'list') {
                    const postsCollectionRef = collection(db, body.collection);

                    const snapshot = await getDocs(postsCollectionRef);

                    const posts = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    return posts;
                } else if (action == 'create') {
                    const docRef = doc(db, body.collection, body.doc);
                    await setDoc(docRef, body.data);

                    return 200;
                } else if (action == 'update') {
                    const postDocRef = doc(db, body.collection, body.doc);

                    await updateDoc(postDocRef, updates);

                    return 200;
                } else if (action == 'delete') {
                    const postDocRef = doc(db, body.collection, body.doc);

                    await deleteDoc(postDocRef);

                    return 200;
                }
            } catch (e) {
                console.error(e);

                return 503;
            }
        }
        
        const db_data = await callapi('get', {
            collection: 'server',
            doc: 'db'
        });

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
                    return 200;
                }
                return
            }
            // window.location.href = "https://saigaikinkyuu.github.io/recipe_site/error/";
            isRedirect = true;
        } else if (!isRun) {
            return 200;
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
}