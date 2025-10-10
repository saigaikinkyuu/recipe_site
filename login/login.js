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
    const pass = document.querySelector("#password");
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

const _0x3e3601=_0x380f;function _0x380f(_0x479bfa,_0x1034ba){const _0x76696e=_0x7669();return _0x380f=function(_0x380f86,_0x4c30b9){_0x380f86=_0x380f86-0xd3;let _0x9e6137=_0x76696e[_0x380f86];return _0x9e6137;},_0x380f(_0x479bfa,_0x1034ba);}(function(_0x258ea2,_0x4eabed){const _0x25a2b5=_0x380f,_0x13767e=_0x258ea2();while(!![]){try{const _0x30d93b=-parseInt(_0x25a2b5(0xd9))/0x1*(-parseInt(_0x25a2b5(0xda))/0x2)+-parseInt(_0x25a2b5(0xd8))/0x3*(parseInt(_0x25a2b5(0xd6))/0x4)+-parseInt(_0x25a2b5(0xe5))/0x5*(parseInt(_0x25a2b5(0xe3))/0x6)+-parseInt(_0x25a2b5(0xd3))/0x7*(parseInt(_0x25a2b5(0xe7))/0x8)+-parseInt(_0x25a2b5(0xe9))/0x9+parseInt(_0x25a2b5(0xde))/0xa+parseInt(_0x25a2b5(0xd5))/0xb;if(_0x30d93b===_0x4eabed)break;else _0x13767e['push'](_0x13767e['shift']());}catch(_0x5aed85){_0x13767e['push'](_0x13767e['shift']());}}}(_0x7669,0x8a052));function _0x7669(){const _0x3f6d64=['home-recipe-be23b.firebaseapp.com','203730hpQpEz','348257ZABxAY','2fbPaAi','querySelector','onAuthStateChanged','catch','1011370WKcYur','addEventListener','../','home-recipe-be23b','href','102594wnGtbC','auth','10rLRWuN','click','3949352hbgopS','#submit','914940ACwcOD','#email','signInWithEmailAndPassword','value','#password','1:801879261323:web:0d2f9552d1058ee99d948e','7rYlpmH','message','15670193NRjSxN','40nDcYCt'];_0x7669=function(){return _0x3f6d64;};return _0x7669();}const firebaseConfig={'apiKey':'AIzaSyDzslg1WbmtYBNFtR3BrrHVvXYTeqanDr8','authDomain':_0x3e3601(0xd7),'projectId':_0x3e3601(0xe1),'storageBucket':'home-recipe-be23b.firebasestorage.app','messagingSenderId':'801879261323','appId':_0x3e3601(0xee),'measurementId':'G-Y12V9FEK27'},app=firebase['initializeApp'](firebaseConfig),auth=app[_0x3e3601(0xe4)](),db=app['firestore']();function Main(){const _0x1dbef3=_0x3e3601,_0x2bbcac=document[_0x1dbef3(0xdb)](_0x1dbef3(0xea)),_0x5cfde4=document[_0x1dbef3(0xdb)](_0x1dbef3(0xed)),_0x249db5=document['querySelector'](_0x1dbef3(0xe8));_0x249db5[_0x1dbef3(0xdf)](_0x1dbef3(0xe6),()=>{const _0x320278=_0x1dbef3;if(!_0x2bbcac['value']&&!_0x5cfde4[_0x320278(0xec)])return;auth[_0x320278(0xeb)](_0x2bbcac[_0x320278(0xec)],_0x5cfde4['value'])[_0x320278(0xdd)](_0x19783b=>{const _0x59b331=_0x320278;alert(_0x19783b[_0x59b331(0xd4)]);});});}auth[_0x3e3601(0xdc)](_0x516a1a=>{const _0x299f0c=_0x3e3601;_0x516a1a?window['location'][_0x299f0c(0xe2)]=_0x299f0c(0xe0):Main();});