class Checker{
  static isLogIn = false;

  static checkLogin(res){
    if (!isLogIn){
      alert("Please, log in.")
      res.redirect("/");
    }
  }

  static CheckingForUserExistence(user, res){
    if (!user){
      alert("User is not exists");
      res.redirect("/log-in");
    }
  }
}