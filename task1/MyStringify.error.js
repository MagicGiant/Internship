class MyStringifyError extends Error{
    constructor(message){
        super(message);
    }

    static CircularStructureError(){
        return new MyStringifyError("Converting circular structure to JSON");
    }
}

module.exports = {
    MyStringifyError: MyStringifyError,
}