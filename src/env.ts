import dotenv from "dotenv";
dotenv.config();

interface envType {
  MYSQL_HOST: string;
  MYSQL_USER_NAME: string; 
  MYSQL_PORT: number; 
  MYSQL_PASSWORD: string; 
  MYSQL_DATABASE: string; 
  MYSQL_CONNECTION_LIMIT: number;
  ENCRYPTION_SECRET?: string;
  ENCRYPTION_SALT_ROUND: number;
}

const env: envType = { 
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_USER_NAME: process.env.MYSQL_USER_NAME || "root",
  MYSQL_PORT: Number(process.env.MYSQL_PORT) || 3306,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "root",
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || "skyd_db",
  MYSQL_CONNECTION_LIMIT: Number(process.env.MYSQL_CONNECTION_LIMIT )|| 12,
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
  ENCRYPTION_SALT_ROUND: Number(process.env.ENCRYPTION_SALT_ROUND),
};

export default env;
