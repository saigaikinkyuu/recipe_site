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
        auth.signInWithEmailAndPassword(email.value, pass.value)
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

const _0x3544be=_0x485d;(function(_0x4e1d2a,_0x54fc62){const _0x43df51=_0x485d,_0x3d3a6b=_0x4e1d2a();while(!![]){try{const _0x19952c=-parseInt(_0x43df51(0x1c0))/0x1+-parseInt(_0x43df51(0x1ce))/0x2*(parseInt(_0x43df51(0x1c5))/0x3)+parseInt(_0x43df51(0x1b8))/0x4+parseInt(_0x43df51(0x1ca))/0x5*(-parseInt(_0x43df51(0x1d0))/0x6)+parseInt(_0x43df51(0x1b6))/0x7+-parseInt(_0x43df51(0x1b7))/0x8*(-parseInt(_0x43df51(0x1be))/0x9)+-parseInt(_0x43df51(0x1cb))/0xa*(parseInt(_0x43df51(0x1bc))/0xb);if(_0x19952c===_0x54fc62)break;else _0x3d3a6b['push'](_0x3d3a6b['shift']());}catch(_0x6c1706){_0x3d3a6b['push'](_0x3d3a6b['shift']());}}}(_0x2a23,0x32b80));const firebaseConfig={'apiKey':_0x3544be(0x1cd),'authDomain':_0x3544be(0x1c7),'projectId':_0x3544be(0x1c3),'storageBucket':_0x3544be(0x1ba),'messagingSenderId':_0x3544be(0x1bf),'appId':_0x3544be(0x1b5),'measurementId':_0x3544be(0x1b4)},app=firebase[_0x3544be(0x1cf)](firebaseConfig),auth=app[_0x3544be(0x1c4)](),db=app['firestore']();function Main(){const _0x4f0ddb=_0x3544be,_0x50818c=document[_0x4f0ddb(0x1c9)]('#email'),_0x1f8cd7=document[_0x4f0ddb(0x1c9)](_0x4f0ddb(0x1b9)),_0x3a6b9f=document[_0x4f0ddb(0x1c9)](_0x4f0ddb(0x1cc));_0x3a6b9f[_0x4f0ddb(0x1c6)]('click',()=>{const _0x31395a=_0x4f0ddb;if(!_0x50818c[_0x31395a(0x1c2)]&&!_0x1f8cd7[_0x31395a(0x1c2)])return;auth[_0x31395a(0x1c1)](_0x50818c[_0x31395a(0x1c2)],_0x1f8cd7[_0x31395a(0x1c2)])[_0x31395a(0x1bb)](_0x22d944=>{alert(_0x22d944['message']);});});}function _0x485d(_0x570c2b,_0x314e03){const _0x2a239e=_0x2a23();return _0x485d=function(_0x485de8,_0x422ae3){_0x485de8=_0x485de8-0x1b4;let _0x3ea156=_0x2a239e[_0x485de8];return _0x3ea156;},_0x485d(_0x570c2b,_0x314e03);}function _0x2a23(){const _0x5096a1=['G-Y12V9FEK27','1:801879261323:web:0d2f9552d1058ee99d948e','2397031yeUgAR','44240jGKwVM','1614728shyaSo','#pass','home-recipe-be23b.firebasestorage.app','catch','11UzrKCa','onAuthStateChanged','495wqPuuc','801879261323','34152BapWZH','signInWithEmailAndPassword','value','home-recipe-be23b','auth','1229415mUBUvw','addEventListener','home-recipe-be23b.firebaseapp.com','href','querySelector','115jQChUU','3780940fEDwCv','#submit','AIzaSyDzslg1WbmtYBNFtR3BrrHVvXYTeqanDr8','2oaeqeK','initializeApp','5340ZuzLld'];_0x2a23=function(){return _0x5096a1;};return _0x2a23();}auth[_0x3544be(0x1bd)](_0x2b1749=>{const _0x39da1e=_0x3544be;_0x2b1749?window['location'][_0x39da1e(0x1c8)]='../':Main();});