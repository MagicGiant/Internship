const Pool = require('pg').Pool
const pool = new Pool({
  user: "Sherka",
  host: "localhost",
  port: 5432,
  database: "fileManager"
})

async function transaction(f, err=null){
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await f(client);
    await client.query("COMMIT");

    return result;
  } catch (error) {
    if(err){
      err();
    } else{
      console.error("Transaction error!")
      console.log(error);
    }
    console.log("Make rollback");
    await client.query('ROLLBACK');
  }  finally{
    client.release();
  }
}

module.exports = {
  transaction: transaction,
  pool: pool,
}