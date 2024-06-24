class User{
  constructor(id, username, password){
    this._id = id;
    this.username = username;
    this.password = password;
  }

  static async createUserFromObj(obj){
    let {id, username, password} = obj;
    return new User(id, username, password);
  }

  _id;

  username;
  password;

  get id(){
    return this._id;
  }
}

module.exports = User;