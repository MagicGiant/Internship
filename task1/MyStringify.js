// Как по мне это лучшее решение, так как оно полностью расширяемое, красивое(не использует уродские свитч кейсы и глобальные переменные), очень быстро работает (без перебора типов) за счет хеш мапы, а так же не выкинет ошибку в случае, если какой-то тип объекта не был рассмотрен (скорее всего просто покажет [object Object])


function MyStringify(value, space = 0){

    if (space === 0){
        MyStringify.newLine = '';
        MyStringify.keyValueSpace = '';
    }
    else{
        MyStringify.newLine = '\n';
        MyStringify.keyValueSpace = ' '
    }


    return MyStringify.recursiveCast(value, space);
}


MyStringify.spaceCount = 0;

MyStringify.strigifyRules = new Map();


MyStringify.getObjectType = (obj) => {
    return Object.prototype.toString.call(obj).match(/\w*(?=])/)[0];
}

MyStringify.getSpaces = () => {
    return " ".repeat(MyStringify.spaceCount);
}

MyStringify.deleteLastComma = (str) =>{
    if (str.lastIndexOf(",") !== -1) {
        return str.slice(0, str.lastIndexOf(",")) + str.slice(str.lastIndexOf(",") + 1);
    }
    return str;
}

MyStringify.recursiveCast = (value, space) =>{

    let type = MyStringify.getObjectType(value);


    if (!MyStringify.strigifyRules.has(type)){
        return MyStringify.getSpaces() + value.toString();
    }

    return MyStringify.strigifyRules.get(type)(value, space);
}
  

// ________set_rules_________


MyStringify.strigifyRules.set('Function', obj =>{
    return null;
})


MyStringify.strigifyRules.set('Set', obj => {
    return '{}';
})

MyStringify.strigifyRules.set('Map', obj => {
    return '{}';
})

MyStringify.strigifyRules.set('String', obj => {
    return `"${obj}"`
})

MyStringify.strigifyRules.set('Date', obj => {
    let date = new Date();
    return `"${obj.toISOString()}"`
})

MyStringify.strigifyRules.set('Array', (obj, space) => {
    let result = MyStringify.getSpaces() + '[' + MyStringify.newLine;

    MyStringify.spaceCount += space;
    for (value of obj){
        result += MyStringify.recursiveCast(value, space) + ',' + MyStringify.newLine;
    }

    result = MyStringify.deleteLastComma(result);

    MyStringify.spaceCount -= space;

    return result + MyStringify.getSpaces() + ']';
})

MyStringify.strigifyRules.set('Object', (obj, space) => {
    let result = MyStringify.getSpaces() + '{' + MyStringify.newLine;

    MyStringify.spaceCount += space;

    for (key in obj){
        result += `${MyStringify.getSpaces()}"${key}":${MyStringify.recursiveCast(obj[key], space)},${MyStringify.newLine}`;
    };

    MyStringify.spaceCount -= space;

    result = MyStringify.deleteLastComma(result);

    return result + MyStringify.getSpaces() + '}';
})


// _________testing____________

function testMyStringify(
    testArray=[
        
        [1,2,3,[1,2,3]],

        {
            1: "1",
            2: [1, 2, {1: "3"}]
        },

        new Array(3),],
    space = 4)
{
    function logLine(){
        console.log("_________________________");
    }

    for (value of testArray){
        const standart = JSON.stringify(value, null, space);
        const my = MyStringify(value, space);
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