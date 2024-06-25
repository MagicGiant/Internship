const {UserTransaction} = require("../transactions/user.transaction");

class Checker {
  static isLogIn = false;

  static async checkingForUserExistence(user) {
    const trUser = await UserTransactions.getUserByName(user.username);
    return trUser == null;
  }

  static async checkingForUserAlreadyExistence(user) {
    const trUser = await UserTransaction.getUserByName(user.username);
    
    return trUser != null;
  }
}

module.exports = Checker;
