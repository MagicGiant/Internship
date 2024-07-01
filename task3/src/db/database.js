const Pool = require("pg").Pool;

class Database {
  constructor(user, host, port, database) {
    Object.assign(this, host, port, user, database);

    this.pool = new Pool({
      user,
      host,
      port,
      database,
    });
  }

  static getDatabaseFromObject({ user, host, port, database }) {
    return new Database(user, host, port, database);
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
