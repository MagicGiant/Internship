const transaction = require("../db/db").transaction;
const { user } = require("pg/lib/defaults");
const User = require("../models/user");

class UserTransaction {
  static async getLastId() {
    return transaction(async (client) => {
      const res = await client.query(
        `SELECT id FROM users ORDER BY id DESC LIMIT 1;`
      );
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0].id;
    });
  }

  static async getUserByName(userName) {
    return transaction(async (client) => {
      const res = await client.query(
        `SELECT * FROM users WHERE username = $1`,
        [userName]
      );
      if (res.rows.length === 0) {
        return null;
      }
      return User.createUserFromObj(res.rows[0]);
    });
  }

  static async getUserById(id) {
    return transaction(async (client) => {
      const res = await client.query(`SELECT * FROM users WHERE id = $1`, [id]);
      if (res.rows.length === 0) {
        return null;
      }
      return User.createUserFromObj(res.rows[0]);
    });
  }

  static async addUser(user) {
    transaction(async (client) => {
      await client.query(
        `INSERT INTO users (id, username, password) VALUES ($1,$2,$3);`,
        [user.id, user.username, user.password]
      );
    });
  }

  static async deleteUserById(id){
    transaction(async (client) => {
      await client.query(
        `DELETE FROM users WHERE id = $1;`,
        [id]
      );
    });
  }

  static async deleteUserByName(username){
    transaction(async (client) => {
      await client.query(
        `DELETE FROM users WHERE username = $1;`,
        [username]
      );
    });
  }
}

module.exports = {
  UserTransaction
}
