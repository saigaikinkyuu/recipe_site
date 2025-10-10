/*const firebaseConfig = {
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
    const email = document.querySelector("#email");
    const pass = document.querySelector("#pass");
    const submit = document.querySelector("#submit");

    submit.addEventListener('click' , () => {
        if(!email.value && !pass.value) return
        auth.signInWithEmailAndPassword(email.value, password.value)
        .catch(error => {
            alert(error.message);
        });
    })
}

auth.onAuthStateChanged(user => {
    if (user) {
        window.location.href = "../";
    }else {
        Main();
    }
})*/

const _0x2c492c=_0x40ed;(function(_0x22dcf7,_0x1686cf){const _0xa57689=_0x40ed,_0xef7722=_0x22dcf7();while(!![]){try{const _0x3a99b3=-parseInt(_0xa57689(0x17e))/0x1*(-parseInt(_0xa57689(0x184))/0x2)+parseInt(_0xa57689(0x179))/0x3*(-parseInt(_0xa57689(0x174))/0x4)+-parseInt(_0xa57689(0x18a))/0x5*(-parseInt(_0xa57689(0x16b))/0x6)+parseInt(_0xa57689(0x173))/0x7*(parseInt(_0xa57689(0x17f))/0x8)+parseInt(_0xa57689(0x17b))/0x9+parseInt(_0xa57689(0x16c))/0xa*(-parseInt(_0xa57689(0x171))/0xb)+parseInt(_0xa57689(0x187))/0xc*(-parseInt(_0xa57689(0x17c))/0xd);if(_0x3a99b3===_0x1686cf)break;else _0xef7722['push'](_0xef7722['shift']());}catch(_0x3bb75a){_0xef7722['push'](_0xef7722['shift']());}}}(_0x5cc2,0x95f91));const firebaseConfig={'apiKey':_0x2c492c(0x16a),'authDomain':_0x2c492c(0x16e),'projectId':_0x2c492c(0x175),'storageBucket':_0x2c492c(0x181),'messagingSenderId':_0x2c492c(0x178),'appId':_0x2c492c(0x182),'measurementId':_0x2c492c(0x188)},app=firebase[_0x2c492c(0x189)](firebaseConfig),auth=app['auth'](),db=app['firestore']();function _0x40ed(_0x31a1b9,_0x4cacf2){const _0x5cc280=_0x5cc2();return _0x40ed=function(_0x40edd6,_0x6f71e){_0x40edd6=_0x40edd6-0x16a;let _0x339422=_0x5cc280[_0x40edd6];return _0x339422;},_0x40ed(_0x31a1b9,_0x4cacf2);}function Main(){const _0x415abe=_0x2c492c,_0x2cd7ad=document['querySelector'](_0x415abe(0x177)),_0x5f0bde=document[_0x415abe(0x172)](_0x415abe(0x17d)),_0x5eddf8=document[_0x415abe(0x172)](_0x415abe(0x185));_0x5eddf8[_0x415abe(0x176)](_0x415abe(0x170),()=>{const _0x36d909=_0x415abe;if(!_0x2cd7ad['value']&&!_0x5f0bde[_0x36d909(0x180)])return;auth[_0x36d909(0x186)](_0x2cd7ad[_0x36d909(0x180)],password[_0x36d909(0x180)])[_0x36d909(0x16d)](_0x348e41=>{alert(_0x348e41['message']);});});}function _0x5cc2(){const _0x25c4e0=['26hedytq','#pass','483xrMVrn','2936tZdnRu','value','home-recipe-be23b.firebasestorage.app','1:801879261323:web:0d2f9552d1058ee99d948e','href','4638kscXeG','#submit','signInWithEmailAndPassword','5032488bljOoM','G-Y12V9FEK27','initializeApp','5vpAHCG','AIzaSyDzslg1WbmtYBNFtR3BrrHVvXYTeqanDr8','3161286nhlGzr','926700FLCOST','catch','home-recipe-be23b.firebaseapp.com','onAuthStateChanged','click','99pfltVK','querySelector','707SqmRCe','4alQMTC','home-recipe-be23b','addEventListener','#email','801879261323','1206309JJFXuE','../','9046305SAvyps'];_0x5cc2=function(){return _0x25c4e0;};return _0x5cc2();}auth[_0x2c492c(0x16f)](_0x3db340=>{const _0x2c27e0=_0x2c492c;_0x3db340?window['location'][_0x2c27e0(0x183)]=_0x2c27e0(0x17a):Main();});