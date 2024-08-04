class A{
  f(){
    let b = new B();
    b.f(this.callback);
  }

  callback(){
    console.log(this.value);
  }
}

class B{

  constructor(){
    this.value = "hello world";
  }

  f(callback){
    callback();
  }
}

let a = new A();
a.f();