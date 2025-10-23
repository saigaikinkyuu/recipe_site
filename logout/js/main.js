function _0x277a(){const _0x236fd7=['7NTdgJQ','contains','9zYQaAo','firestore','4009440AIOzbO','2875140wmdaSK','onerror','createObjectStore','onAuthStateChanged','35uabiEV','oncomplete','log','target','onsuccess','close','G-Y12V9FEK27','users','transaction','open','7xVdMkT','490332AAlKZi','765558elyTcy','objectStoreNames','delete','165hVgtfp','USER\x20LOGIN\x20ERROR:USER\x20IS\x20NOT\x20FOUND','objectStore','724ChwLNU','9393TETCKS','initializeApp','2521506WFKMUc','801879261323','error','home-recipe-be23b.firebasestorage.app','result','onupgradeneeded','292570jXlMNW'];_0x277a=function(){return _0x236fd7;};return _0x277a();}const _0x3f99b7=_0x5d86;(function(_0x5eb705,_0x5be77b){const _0x395721=_0x5d86,_0xca5ec3=_0x5eb705();while(!![]){try{const _0x1c1f0f=-parseInt(_0x395721(0x167))/0x1*(parseInt(_0x395721(0x153))/0x2)+parseInt(_0x395721(0x14b))/0x3*(parseInt(_0x395721(0x14a))/0x4)+parseInt(_0x395721(0x15d))/0x5*(parseInt(_0x395721(0x169))/0x6)+parseInt(_0x395721(0x154))/0x7*(-parseInt(_0x395721(0x158))/0x8)+-parseInt(_0x395721(0x156))/0x9*(-parseInt(_0x395721(0x159))/0xa)+-parseInt(_0x395721(0x16c))/0xb*(-parseInt(_0x395721(0x168))/0xc)+-parseInt(_0x395721(0x14d))/0xd;if(_0x1c1f0f===_0x5be77b)break;else _0xca5ec3['push'](_0xca5ec3['shift']());}catch(_0x46cbda){_0xca5ec3['push'](_0xca5ec3['shift']());}}}(_0x277a,0x9c882));const firebaseConfig={'apiKey':'AIzaSyDzslg1WbmtYBNFtR3BrrHVvXYTeqanDr8','authDomain':'home-recipe-be23b.firebaseapp.com','projectId':'home-recipe-be23b','storageBucket':_0x3f99b7(0x150),'messagingSenderId':_0x3f99b7(0x14e),'appId':'1:801879261323:web:0d2f9552d1058ee99d948e','measurementId':_0x3f99b7(0x163)},app=firebase[_0x3f99b7(0x14c)](firebaseConfig),auth=app['auth'](),db=app[_0x3f99b7(0x157)]();function _0x5d86(_0x574bd0,_0x378b4a){const _0x277abb=_0x277a();return _0x5d86=function(_0x5d863e,_0x56662e){_0x5d863e=_0x5d863e-0x149;let _0xbe4b4e=_0x277abb[_0x5d863e];return _0xbe4b4e;},_0x5d86(_0x574bd0,_0x378b4a);}auth[_0x3f99b7(0x15c)](async _0x4ea2a7=>{const _0x127e10=_0x3f99b7;try{if(_0x4ea2a7)auth['signOut'](),await deleteUserData();else throw new Error(_0x127e10(0x16d));}catch(_0x5049dd){console[_0x127e10(0x15f)](_0x5049dd);}finally{window[_0x127e10(0x162)]();}});async function deleteUserData(){const _0x2a0274=_0x3f99b7,_0x345f37=await openDatabase(),_0x20b586=_0x345f37[_0x2a0274(0x165)](['users'],'readwrite'),_0x58f16c=_0x20b586[_0x2a0274(0x149)](_0x2a0274(0x164));return new Promise((_0x25d0dc,_0x11d221)=>{const _0x1f8a77=_0x2a0274,_0x194436=_0x58f16c[_0x1f8a77(0x16b)](0x1);_0x194436['onsuccess']=()=>{_0x25d0dc(!![]);},_0x194436[_0x1f8a77(0x15a)]=_0x4914af=>{const _0x18a999=_0x1f8a77;_0x11d221(_0x4914af[_0x18a999(0x160)][_0x18a999(0x14f)]);},_0x20b586[_0x1f8a77(0x15e)]=()=>{const _0x1de5e8=_0x1f8a77;_0x345f37[_0x1de5e8(0x162)]();};});}function openDatabase(){return new Promise((_0x3b8dde,_0x5aec78)=>{const _0x36eaae=_0x5d86,_0x1a5e04=indexedDB[_0x36eaae(0x166)]('authDatabase',0x1);_0x1a5e04[_0x36eaae(0x152)]=_0x3174c6=>{const _0x31933d=_0x36eaae,_0x4afa2e=_0x3174c6[_0x31933d(0x160)]['result'];!_0x4afa2e[_0x31933d(0x16a)][_0x31933d(0x155)]('users')&&_0x4afa2e[_0x31933d(0x15b)](_0x31933d(0x164),{'keyPath':'id','autoIncrement':!![]});},_0x1a5e04[_0x36eaae(0x161)]=_0x392fa2=>{const _0x4a12df=_0x36eaae;_0x3b8dde(_0x392fa2[_0x4a12df(0x160)][_0x4a12df(0x151)]);},_0x1a5e04['onerror']=_0x4e5a11=>{const _0x5911f0=_0x36eaae;_0x5aec78(_0x4e5a11[_0x5911f0(0x160)][_0x5911f0(0x14f)]);};});}
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

auth.onAuthStateChanged(async (user) => {
    try{
        if(user){
            auth.signOut();
            await deleteCookie('token');
        }else {
            throw new Error("USER LOGIN ERROR:USER IS NOT FOUND");
        }
    }catch(e){
        console.log(e);
    }finally{
        window.close();
    }
})

async function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure';
}