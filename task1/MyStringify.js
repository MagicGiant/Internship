// Как по мне это лучшее решение, так как оно полностью расширяемое, красивое(не использует уродские свитч кейсы и глобальные переменные), очень быстро работает (без перебора типов) за счет хеш мапы, а так же не выкинет ошибку в случае, если какой-то тип объекта не был рассмотрен (скорее всего просто покажет [object Object])

//Основной метод:
//Смысл в том, что я из хеш мапы (stringifyRules) в методе recursiveCast мгновенно вытаскиваю функцию по определенному ключу (имя типа объекта). Эта функция, если потребуется, может рекурсивно запустить recursiveCast. Поэтому должно работать быстро
function MyStringify(value, space = 0) {
  if (space === 0) {
    MyStringify.newLine = "";
  } else {
    MyStringify.newLine = "\n";
  }

  MyStringify.prevObject = null;

  MyStringify.spaceCount = 0;

  return MyStringify.recursiveCast(value, space, null);
}

MyStringify.strigifyRules = new Map();

//Тут я просто не додумался, как по другому получить тип объекта. Регулярка получает из "[Object Array]" только "Array"
MyStringify.getObjectType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\w*(?=])/)[0];
};

MyStringify.getSpaces = () => {
  return " ".repeat(MyStringify.spaceCount);
};

MyStringify.deleteLastComma = (str) => {
  if (str.lastIndexOf(",") !== -1) {
    return (
      str.slice(0, str.lastIndexOf(",")) + str.slice(str.lastIndexOf(",") + 1)
    );
  }
  return str;
};

MyStringify.recursiveCast = (value, space, prevObject) => {
  let type = MyStringify.getObjectType(value);

  if (!MyStringify.strigifyRules.has(type)) {
    return MyStringify.getSpaces() + value.toString();
  }

  return MyStringify.strigifyRules.get(type)(value, space, prevObject);
};

// ________set_rules_________

MyStringify.strigifyRules.set("Function", () => {
  return null;
});

MyStringify.strigifyRules.set("Set", () => {
  return "{}";
});

MyStringify.strigifyRules.set("Map", () => {
  return "{}";
});

MyStringify.strigifyRules.set("String", (obj) => {
  return `"${obj}"`;
});

MyStringify.strigifyRules.set("Date", (obj) => {
  let date = new Date();
  return `"${obj.toISOString()}"`;
});

MyStringify.strigifyRules.set("Array", (obj, space, prevObject) => {
  if (obj.length === 0) {
    return "[]";
  }

  let firstSpaces = prevObject == "Object" ? "" : MyStringify.getSpaces();

  let result = firstSpaces + "[" + MyStringify.newLine;

  MyStringify.spaceCount += space;
  for (let value of obj) {
    let recursiveData =
      value == undefined
        ? MyStringify.getSpaces() + "null"
        : MyStringify.recursiveCast(value, space, "Array");
    result += recursiveData + "," + MyStringify.newLine;
  }

  result = MyStringify.deleteLastComma(result);

  MyStringify.spaceCount -= space;

  return result + MyStringify.getSpaces() + "]";
});

MyStringify.strigifyRules.set("Object", (obj, space, prevObject) => {
  if (Object.keys(obj).length === 0) {
    return "{}";
  }

  let firstSpaces = prevObject == "Object" ? "" : MyStringify.getSpaces();
  let result = firstSpaces + "{" + MyStringify.newLine;

  MyStringify.spaceCount += space;

  for (let key in obj) {
    let recursiveData =
      obj[key] == undefined
        ? MyStringify.getSpaces() + "null"
        : MyStringify.recursiveCast(obj[key], space, "Object");
    result += `${MyStringify.getSpaces()}"${key}": ${recursiveData},${
      MyStringify.newLine
    }`;
  }

  MyStringify.spaceCount -= space;

  result = MyStringify.deleteLastComma(result);

  return result + MyStringify.getSpaces() + "}";
});

// _________testing____________

let testArr = [
  [1, 2, 3, [1, 2, 3]],
  {
    1: "1",
    2: [1, 2, { 4: "3" }],
  },
  new Array(3),
  new Array(0),
  {},
];

let testSpace = 4;

function testMyStringify(
  testArray = testArr,
  space = testSpace,
  cyclicFunction = null
) {
  for (let value of testArray) {
    const standart = JSON.stringify(value, null, space);
    const my = MyStringify(value, space);
    if (standart === my) {
      console.log("OK!");
    } else {
      console.log("DIFFERENT");
    }

    if (cyclicFunction != null) {
      cyclicFunction(standart, my);
    }
  }
}

function testMyStringifyWithData(standart, my) {
  function logLine() {
    console.log("_________________________");
  }

  logLine();
  console.log("JSON.stringfy");
  console.log(standart);
  console.log("MyStringfy");
  console.log(my);
  logLine();
}

testMyStringify(testArr, testSpace, testMyStringifyWithData);
testMyStringify();
