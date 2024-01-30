import mysql, { PoolOptions } from "mysql2";
import env from "../env";
import { initDBQuery } from "./init.sql";

const poolConfig: PoolOptions = {
  host: env.MYSQL_HOST,
  user: env.MYSQL_USER_NAME,
  port: env.MYSQL_PORT,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  connectionLimit: env.MYSQL_CONNECTION_LIMIT,
  multipleStatements : true
};

const pool = mysql.createPool(poolConfig);

export async function getDatabase() {
  console.log(initDBQuery)
  pool.query(initDBQuery, [],(err, result) => {
    if (err) {
      console.log("Error --> ", err);
    } else {
      console.log("Result --> ", result);
    }
  })
}

export default pool;
