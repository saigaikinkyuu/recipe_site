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
        auth.signInWithEmailAndPassword(email, password)
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

const _0x511b41=_0x18c3;(function(_0x50b6b9,_0x122e12){const _0x2049da=_0x18c3,_0x3e5228=_0x50b6b9();while(!![]){try{const _0x5e79ce=-parseInt(_0x2049da(0x100))/0x1*(parseInt(_0x2049da(0x102))/0x2)+-parseInt(_0x2049da(0xf3))/0x3+-parseInt(_0x2049da(0xfe))/0x4*(parseInt(_0x2049da(0x103))/0x5)+-parseInt(_0x2049da(0x107))/0x6+-parseInt(_0x2049da(0xf7))/0x7*(-parseInt(_0x2049da(0xfc))/0x8)+-parseInt(_0x2049da(0xff))/0x9+-parseInt(_0x2049da(0x10a))/0xa*(-parseInt(_0x2049da(0xf6))/0xb);if(_0x5e79ce===_0x122e12)break;else _0x3e5228['push'](_0x3e5228['shift']());}catch(_0x1dbb48){_0x3e5228['push'](_0x3e5228['shift']());}}}(_0x6275,0x38592));function _0x18c3(_0x533aa8,_0x2c88f8){const _0x627587=_0x6275();return _0x18c3=function(_0x18c38e,_0x5cf7fc){_0x18c38e=_0x18c38e-0xf2;let _0x44d9b6=_0x627587[_0x18c38e];return _0x44d9b6;},_0x18c3(_0x533aa8,_0x2c88f8);}const firebaseConfig={'apiKey':_0x511b41(0xf8),'authDomain':_0x511b41(0x109),'projectId':_0x511b41(0x101),'storageBucket':_0x511b41(0x10b),'messagingSenderId':'801879261323','appId':_0x511b41(0x104),'measurementId':_0x511b41(0xf9)},app=firebase['initializeApp'](firebaseConfig),auth=app[_0x511b41(0xfa)](),db=app[_0x511b41(0x108)]();function Main(){const _0x3ab291=_0x511b41,_0x28dd11=document[_0x3ab291(0xf4)]('#email'),_0xe4da56=document['querySelector'](_0x3ab291(0xf2)),_0x2816fc=document[_0x3ab291(0xf4)](_0x3ab291(0x106));_0x2816fc[_0x3ab291(0xfd)](_0x3ab291(0xf5),()=>{const _0x5a8a13=_0x3ab291;if(!_0x28dd11['value']&&!_0xe4da56['value'])return;auth[_0x5a8a13(0x10c)](_0x28dd11,password)[_0x5a8a13(0x105)](_0x3d91fe=>{alert(_0x3d91fe['message']);});});}function _0x6275(){const _0x3e8062=['addEventListener','12EOHaZT','839952hBLZzL','1kkwBuB','home-recipe-be23b','6814UBWlCH','734015fZwhoC','1:801879261323:web:0d2f9552d1058ee99d948e','catch','#submit','2069916laQBGr','firestore','home-recipe-be23b.firebaseapp.com','1595820YWWJSO','home-recipe-be23b.firebasestorage.app','signInWithEmailAndPassword','../','#pass','1228062WdJTaQ','querySelector','click','77LpdQRX','1652IoEzwK','AIzaSyDzslg1WbmtYBNFtR3BrrHVvXYTeqanDr8','G-Y12V9FEK27','auth','href','13736eqreqM'];_0x6275=function(){return _0x3e8062;};return _0x6275();}auth['onAuthStateChanged'](_0x506f7a=>{const _0x116470=_0x511b41;_0x506f7a?window['location'][_0x116470(0xfb)]=_0x116470(0x10d):Main();});