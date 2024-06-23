// Как по мне это лучшее решение, так как оно полностью расширяемое, красивое(не использует уродские свитч кейсы и глобальные переменные), очень быстро работает (без перебора типов) за счет хеш мапы, а так же не выкинет ошибку в случае, если какой-то тип объекта не был рассмотрен (скорее всего просто покажет [object Object])

//Основной метод:
//Смысл в том, что я из хеш мапы (stringifyRules) в методе recursiveCast мгновенно вытаскиваю функцию по определенному ключу (имя типа объекта). Эта функция, если потребуется, может рекурсивно запустить recursiveCast. Поэтому должно работать быстро

function myStringify(value, space = 0) {
  if (space == null || space === 0) {
    myStringify.newLine = "";
    myStringify.objectSpace = "";
  } else {
    myStringify.newLine = "\n";
    myStringify.objectSpace = " ";
  }

  myStringify.prevObject = null;

  myStringify.spaceCount = 0;

  return myStringify.recursiveCast(value, space, null);
}

myStringify.strigifyRules = new Map();

myStringify.getObjectType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\w*(?=])/)[0];
};

myStringify.getSpaces = () => {
  return " ".repeat(myStringify.spaceCount);
};

myStringify.deleteLastComma = (str) => {
  if (str.lastIndexOf(",") !== -1) {
    return (
      str.slice(0, str.lastIndexOf(",")) + str.slice(str.lastIndexOf(",") + 1)
    );
  }
  return str;
};

myStringify.recursiveCast = (value, space, prevObject) => {
  let type = myStringify.getObjectType(value);

  if (!myStringify.strigifyRules.has(type)) {
    return myStringify.getSpaces() + value.toString();
  }

  return myStringify.strigifyRules.get(type)(value, space, prevObject);
};

// ________set_rules_________

myStringify.strigifyRules.set("Function", () => {
  return null;
});

myStringify.strigifyRules.set("Set", () => {
  return "{}";
});

myStringify.strigifyRules.set("Map", () => {
  return "{}";
});

myStringify.strigifyRules.set("String", (obj) => {
  return `"${obj}"`;
});

myStringify.strigifyRules.set("Date", (obj) => {
  let date = new Date();
  return `"${obj.toISOString()}"`;
});

myStringify.strigifyRules.set("Array", (obj, space, prevObject) => {
  if (obj.length === 0) {
    return "[]";
  }

  let firstSpaces = prevObject == "Object" ? "" : myStringify.getSpaces();

  let result = `${firstSpaces}[${myStringify.newLine}`;

  myStringify.spaceCount += space;
  for (let value of obj) {
    let recursiveData =
      value == undefined
        ? myStringify.getSpaces() + "null"
        : myStringify.recursiveCast(value, space, "Array");
    result += `${recursiveData},${myStringify.newLine}`;
  }

  result = myStringify.deleteLastComma(result);

  myStringify.spaceCount -= space;

  return `${result + myStringify.getSpaces()}]`;
});

myStringify.strigifyRules.set("Object", (obj, space, prevObject) => {
  if (Object.keys(obj).length === 0) {
    return "{}";
  }
  let result = `${myStringify.getSpaces()}{${myStringify.newLine}`;

  myStringify.spaceCount += space;

  for (let key in obj) {
    let recursiveData =
      obj[key] == undefined
        ? myStringify.getSpaces() + "null"
        : myStringify.recursiveCast(obj[key], space, "Object");
    result += `${myStringify.getSpaces()}"${key}":${myStringify.objectSpace}${recursiveData},${
      myStringify.newLine
    }`;
  }

  myStringify.spaceCount -= space;

  result = myStringify.deleteLastComma(result);

  return `${result + myStringify.getSpaces()}}`;
});

module.exports = {
  myStringify: myStringify,
};
