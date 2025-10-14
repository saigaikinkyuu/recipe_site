auth.onAuthStateChanged(user => {
    try{
        if(user){
            auth.signOut();
        }else {
            throw new Error("USER LOGIN ERROR:USER IS NOT FOUND");
        }
    }catch(e){
        console.log(e);
    }finally{
        window.close();
    }
})