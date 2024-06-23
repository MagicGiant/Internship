"use strict";
const myStringify = require("./MyStringify").myStringify;

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
