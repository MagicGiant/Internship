module.exports = {
  myStringify: myStringify,
};

const MyStringifyError = require("./MyStringify.error").MyStringifyError;

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

myStringify.visitedObjects = new Set();

myStringify.inTypes = (obj, arrayObjectsType) => {
  if (obj == null) {
    return false;
  }

  for (let el of arrayObjectsType) {
    if (el == myStringify.getObjectType(obj)) {
      return true;
    }
  }
  return false;
};

myStringify.markObject = (obj) => {
  if (!myStringify.inTypes(obj, ["Array", "Object"])) {
    return false;
  }

  myStringify.visitedObjects.add(obj);
  return true;
};

myStringify.isMark = (obj) => {
  return (
    myStringify.inTypes(obj, ["Array", "Object"]) &&
    myStringify.visitedObjects.has(obj)
  );
};

myStringify.unmarkObject = (obj) => {
  if (myStringify.isMark(obj)) {
    myStringify.visitedObjects.delete(obj);
  }
};

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

myStringify.getFirstSpaces = (prevObject) => {
  return myStringify.getObjectType(prevObject) == "Object"
    ? ""
    : myStringify.getSpaces();
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

myStringify.strigifyRules.set("BigInt", (obj) => {
  throw MyStringifyError.serializeBigIntError();
})

myStringify.strigifyRules.set("Array", (obj, space, prevObject) => {
  if (obj.length === 0) {
    return "[]";
  }

  if (myStringify.isMark(obj)) {
    throw MyStringifyError.circularStructureError();
  }

  myStringify.markObject(obj);

  let result = `${myStringify.getFirstSpaces(prevObject)}[${
    myStringify.newLine
  }`;

  myStringify.spaceCount += space;
  for (let value of obj) {
    let recursiveData =
      value == undefined
        ? myStringify.getSpaces() + "null"
        : myStringify.recursiveCast(value, space, obj);
    result += `${recursiveData},${myStringify.newLine}`;
  }

  result = myStringify.deleteLastComma(result);

  myStringify.spaceCount -= space;

  myStringify.unmarkObject(obj);

  return `${result + myStringify.getSpaces()}]`;
});

myStringify.strigifyRules.set("Object", (obj, space, prevObject) => {
  if (Object.keys(obj).length === 0) {
    return "{}";
  }

  if (myStringify.isMark(obj)) {
    throw MyStringifyError.circularStructureError();
  }

  myStringify.markObject(obj);

  let result = `${myStringify.getFirstSpaces(prevObject)}{${
    myStringify.newLine
  }`;

  myStringify.spaceCount += space;

  for (let key in obj) {
    let recursiveData =
      obj[key] == undefined
        ? myStringify.getSpaces() + "null"
        : myStringify.recursiveCast(obj[key], space, obj);

    result += `${myStringify.getSpaces()}"${key}":${
      myStringify.objectSpace
    }${recursiveData},${myStringify.newLine}`;
  }

  myStringify.spaceCount -= space;

  result = myStringify.deleteLastComma(result);

  myStringify.unmarkObject(obj);

  return `${result + myStringify.getSpaces()}}`;
});
