class MyStringifyError extends Error {
  constructor(message) {
    super(message);
  }

  static circularStructureError() {
    return new MyStringifyError("Converting circular structure to JSON");
  }

  static serializeBigIntError(){
    return new MyStringifyError("Do not know how to serialize a BigInt");
  }
}

module.exports = {
  MyStringifyError: MyStringifyError,
};
