export function heavyWork() {
    let i = 0;
    while (i<10000000000) {
        i++;
    }
    return true
}

export function AsyncTest(){
    return new Promise((resolve,resject)=>{
        setTimeout(() => {
            resolve(true)
        }, 3000);
    })
}