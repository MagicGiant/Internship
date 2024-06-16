// Как по мне это лучшее решение, так как оно полностью расширяемое, красивое(не использует уродские свитч кейсы), очень быстро работает (без перебора типов) за счет хеш мапы, а так же не выкинет ошибку в случае, если какой-то тип объекта не был рассмотрен (скорее всего просто покажет [object Object])

// Проблема, которую я заметил. Нельзя задать одинаковое поведение в одном сете для нескольких типов Объектов. Для каждого типа нужен отдельный сет. Возможно так даже лучше, но код при расширении может получиться громоздким. 
// Можно решить проблему, если изменить getObjectType определенным образом и немного по другому хранить ключи




let strigifyRules = new Map();

let spaceCount = 0;
let newLine = ''
let keyValueSpace = ''

 

function getObjectType(obj){
    return Object.prototype.toString.call(obj).match(/\w*(?=])/)[0];
}

function getSpaces(){
    return " ".repeat(spaceCount);
}


function myStringify(value, space = 0){
    if (space != 0){
        newLine = '\n';
        keyValueSpace = " ";
    }

    let type = getObjectType(value);


    if (!strigifyRules.has(type)){
        return getSpaces() + value.toString();
    }

    return strigifyRules.get(type)(value, space);
}

function deleteLastComma(str){
    if (str.lastIndexOf(",") !== -1) {
        return str.slice(0, str.lastIndexOf(",")) + str.slice(str.lastIndexOf(",") + 1);
    }
    return str;
}
  

// ________set_rules_________


strigifyRules.set('Function', obj =>{
    return null;
})


strigifyRules.set('Set', obj => {
    return '{}';
})

strigifyRules.set('Map', obj => {
    return '{}';
})

strigifyRules.set('String', obj => {
    return `"${obj}"`
})

strigifyRules.set('Date', obj => {
    let date = new Date();
    return `"${obj.toISOString()}"`
})

strigifyRules.set('Array', (obj, space) => {
    let result = getSpaces() + '[' + newLine;

    spaceCount += space;
    for (value of obj){
        result += myStringify(value, space) + ',' + newLine;
    }

    result = deleteLastComma(result);

    spaceCount -= space;

    return result + getSpaces() + ']';
})

strigifyRules.set('Object', (obj, space) => {
    let result = getSpaces() + '{' + newLine;

    spaceCount += space;

    for (key in obj){
        result += `${getSpaces()}"${key}":${myStringify(obj[key], space)},${newLine}`;
    };

    spaceCount -= space;

    result = deleteLastComma(result);

    return result + getSpaces() + '}';
})


// _________testing____________

function testMyStringify(testArray=[[1,2,3,[1,2,3]], a], space = 4){

    function logLine(){
        console.log("_________________________");
    }

    for (value of testArray){
        const standart = JSON.stringify(value, null, space);
        const my = myStringify(value, space);
        if (standart === my){
            console.log("OK!");
        }
        else{
            console.log("DIFFERENT");
        }
        logLine();
        console.log("JSON.stringfy");
        console.log(standart);
        console.log("MyStringfy");
        console.log(my);
        logLine();
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
