const Pool = require("pg").Pool;

class Database {
  constructor(user, host, port, database, password) {
    Object.assign(this, host, port, user, database, password);

    this.pool = new Pool({
      user,
      host,
      port,
      database,
      password
    });
  }

  static getDatabaseFromObject({ user, host, port, database,  password}) {
    return new Database(user, host, port, database, password);
  }

  async transaction(f, err = null) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await f(client);
      await client.query("COMMIT");

      return result;
    } catch (error) {
      if (err) {
        err();
      } else {
        console.error("Transaction error!");
        console.log(error);
      }
      console.log("Make rollback");
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }
}

module.exports = Database;
