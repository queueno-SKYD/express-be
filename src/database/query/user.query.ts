import { tablesName, userTable } from "../init.sql";
import UserType from "./user.type";

const USER_QUERY = {
  INSERT_USER: (data: UserType) => `INSERT INTO ${tablesName.userTable} (${userTable.firstName}, ${userTable.lastName}, ${userTable.email}, ${userTable.createdBy})
                                    VALUES (${data.firstName}, ${data.lastName}, ${data.email}, ${data.createdBy});`,
}

export default USER_QUERY;
