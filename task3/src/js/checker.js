class Checker {
  constructor(userRepository){
    this.userRepository = userRepository;
    this.isLogIn = false;
  }

  async checkingForUserExistence(user) {
    const trUser = await this.userRepository.getUserByName(user.username);
    return trUser == null;
  }

  async checkingForUserAlreadyExistence(user) {
    const trUser = await this.userRepository.getUserByName(user.username);
    
    return trUser != null;
  }

  ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.send(MessageRedirect.doesNotLogInMessage("/"))
  }
}

module.exports = Checker;
