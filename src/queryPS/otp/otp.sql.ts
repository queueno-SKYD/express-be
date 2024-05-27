import { otpTable, tablesName } from "../../database/init.sql";

// insert otp query
export const insertOtpQuery = `INSERT INTO ${tablesName.otpTable} (${otpTable.emailId}, ${otpTable.otp}, ${otpTable.otptype}) VALUES (?, ?, ?)`;

// delete otp query
export const deleteOtpQuery = `DELETE FROM ${tablesName.otpTable} WHERE emailId = ?`;

// get otp query
export const getOtpQuery = `SELECT * FROM ${tablesName.otpTable} WHERE emailId = ?`;

// update otp query
export const updateOtpQuery = `
  UPDATE ${tablesName.otpTable} SET otp = ?  WHERE emailId = ?
`;
