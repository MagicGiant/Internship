class MessageRedirect{
  static alertRedirectString(message, location) {
    return `<script>alert("${message}");window.location.href = "${location}"; </script>`;
  }

  static doesNotLogInMessage(location){
    return MessageRedirect.alertRedirectString("Please, log in or sing up.", location);
  }

  static userAlreadyExistenceMessage(location){
    return MessageRedirect.alertRedirectString("This user already exist", location);
  }

  static passwordOrLoginIncorrect(location){
    return MessageRedirect.alertRedirectString("Password or login incorrect", location);
  }

  static passwordsMismatch(location){
    return MessageRedirect.alertRedirectString("Your passwords mismatch, repeat please", location);
  }
}

module.exports = MessageRedirect;