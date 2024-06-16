// Как по мне это лучшее решение, так как оно полностью расширяемое, красивое(не использует уродские свитч кейсы), очень быстро работает (без перебора типов) за счет хеш мапы, а так же не выкинет ошибку в случае, если какой-то тип объекта не был рассмотрен (скорее всего просто покажет [object Object])

// Проблема, которую я заметил. Нельзя задать одинаковое поведение в одном сете для нескольких типов Объектов. Для каждого типа нужен отдельный сет. Возможно так даже лучше, но код при расширении может получиться громоздким. 
// Можно решить проблему, если изменить getObjectType определенным образом и немного по другому хранить ключи




let strigifyRules = new Map();

 

function getObjectType(obj){
    return Object.prototype.toString.call(obj).match(/\w*(?=])/)[0];
}


function MyStringify(value){
    let type = getObjectType(value);

    if (!strigifyRules.has(type)){
        return value.toString();
    }

    return strigifyRules.get(type)(value);
}

function DeleteLastComma(str){
    if (str.slice(-1) == ',')
        return str.slice(0, -1);
    return str;
}

// ________set_rules_________


strigifyRules.set('Function', (obj) =>{
    return null;
})


strigifyRules.set('Set', (obj) => {
    return '{}';
})

strigifyRules.set('Map', (obj) => {
    return '{}';
})

strigifyRules.set('String', (obj) => {
    return `"${obj}"`
})

strigifyRules.set('Date', (obj) => {
    let date = new Date();
    return `"${obj.toISOString()}"`
})

strigifyRules.set('Array', (obj) => {
    let result = '[';
    for (value of obj){
        result += MyStringify(value) + ',';
    }

    result = DeleteLastComma(result);

    return result + ']';
})

strigifyRules.set('Object', (obj) => {
    let result = '{';

    for (key in obj){
        result += `"${key}":${MyStringify(obj[key])},`;
    };


    result = DeleteLastComma(result);

    return result + '}';
})


// _________testing____________

function testMyStringify(testArray= [a, arr, map, set, number, f, user, date]){

    function logLine(){
        console.log("_________________________");
    }

    for (value of testArray){
        const standart = JSON.stringify(value);
        const my = MyStringify(value);
        if (standart === my){
            console.log("OK!");
        }
        else{
            console.log("DIFFERENT");
            logLine();
            console.log("JSON.stringfy");
            console.log(standart);
            console.log("MyStringfy");
            console.log(my);
            logLine();
        }
    }
}


let a = {
    hello : "a",
    b : [1, 2, 3, 4],
    c: {
        a: "a",
    }
}

let arr = [
    1,
    2,
    function(){console.log("hello");}
]

let map = new Map();

let set = new Set();

set.add(1);
set.add(2);

let number = new Number(3);

function f(params) {}

class User {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }

}

let user = new User("Иван");
let date = new Date();

testMyStringify()
