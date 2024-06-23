"use strict";
const myStringify = require("./MyStringify").myStringify;

const MyStringifyError = require("./MyStringify.error").MyStringifyError

testCircular_error();
testElements_equal();

function testElements_equal() {
  const elements = [
    [1, 2, 3, [1, 2, 3]],
    {
      1: "1",
      2: [1, 2, { 4: "3" }],
    },
    new Array(3),
    new Array(0),
    {},
  ];

  const testElement = (el, space = null) => {
    test("test element myStringify", () => {
      expect(myStringify(el, space)).toBe(JSON.stringify(el, null, space));
    });
  };

  for (const el of elements) {
    testElement(el);
    testElement(el, 4);
  }
}


function testCircular_error(){
  let a = [1, 2];
  let b = [3, a];

  a.push(b);

  
  test("Test circular structure", () =>{
    expect(() => myStringify(a)).toThrow(MyStringifyError.CircularStructureError());
  });
}

