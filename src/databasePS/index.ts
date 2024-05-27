import env from "../env";
import { Pool } from "pg";
import {
  CreateUsers,
  CreatedocumentTable,
  CreategroupMemberTable,
  CreategroupMessageTable,
  CreategroupTable,
  CreateimagesTable,
  CreatemediaTable,
  CreatemessageContentTable,
  CreateotpTable,
  CreatepersonalChatTable,
  CreatepersonalMessageTable,
  CreateshareDocument,
} from "./init.sql";
// const { Pool } = require("pg");
const pool = new Pool({
  connectionString: env.POSTGRESS_SQL_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
export async function getDatabase() {
  await pool.query(CreateUsers);
  await pool.query(CreatedocumentTable);
  await pool.query(CreateimagesTable);
  await pool.query(CreatemediaTable);
  await pool.query(CreateshareDocument);
  await pool.query(CreategroupTable);
  await pool.query(CreategroupMemberTable);
  await pool.query(CreatepersonalChatTable);
  await pool.query(CreategroupMessageTable);
  await pool.query(CreatepersonalMessageTable);
  await pool.query(CreatemessageContentTable);
  await pool.query(CreateotpTable);
  console.log("table created ---------Done ---------")
}

export default pool;
