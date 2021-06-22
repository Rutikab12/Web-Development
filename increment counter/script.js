const counter = document.querySelectorAll('.counter');

counter.forEach((counter)=> {
    counter.innerHTML=0;

    const updateCounter = ()=>{
        const targetCount = +counter.getAttribute('data-target');

        const startingCount = Number(counter.innerHTML);

        const inc = targetCount/100;

        if(startingCount<targetCount){
            counter.innerHTML = `${Math.round(startingCount + inc)}`;
            setTimeout(updateCounter,10);
        }else{
            counter.innerHTML = targetCount;
        }
    }

    updateCounter();
})


/*

several ways to achieve it:

//using the unary plus operator
var n =+ str;

//The number constructor
var n = Number(str)

//The parsefloat function
var n = parseFloat(str)

*/