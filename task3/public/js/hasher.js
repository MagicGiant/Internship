const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function checkPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  checkPassword
}