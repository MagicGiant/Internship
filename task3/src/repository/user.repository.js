const User = require("../models/user");

class UserRepository {
  constructor(database) {
    this.db = database;
  }

  async getLastId() {
    return this.db.transaction(async (client) => {
      const res = await client.query(
        `SELECT id FROM users ORDER BY id DESC LIMIT 1;`
      );
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0].id;
    });
  }

  async getUserByName(userName) {
    return this.db.transaction(async (client) => {
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

  async getUserById(id) {
    return this.db.transaction(async (client) => {
      const res = await client.query(`SELECT * FROM users WHERE id = $1`, [id]);
      if (res.rows.length === 0) {
        return null;
      }
      return User.createUserFromObj(res.rows[0]);
    });
  }

  async addUser(user) {
    this.db.transaction(async (client) => {
      await client.query(
        `INSERT INTO users (id, username, password) VALUES ($1,$2,$3);`,
        [user.id, user.username, user.password]
      );
    });
  }

  async deleteUserById(id) {
    this.db.transaction(async (client) => {
      await client.query(`DELETE FROM users WHERE id = $1;`, [id]);
    });
  }

  async deleteUserByName(username) {
    this.db.transaction(async (client) => {
      await client.query(`DELETE FROM users WHERE username = $1;`, [username]);
    });
  }
}

module.exports = UserRepository;
