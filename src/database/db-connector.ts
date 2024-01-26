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
};

const pool = mysql.createPool(poolConfig).promise();

export async function getDatabase() {
  try {
    console.log(initDBQuery)
    const data = await pool.query(initDBQuery);
    console.log(data);
  } catch (err) {
    console.log(err)
  }
}

export default pool;
