import { ResultSetHeader } from "mysql2";
import pool from "../../database";
import logger from "../../../logger";
import GroupMemberModel from "../../model/groupMemberModel";
import { GetAllGroupMembers, SaveGroupAllMemberQuery, SaveGroupMemberQuery, getTotalMember, isAdminQuery, makeAdminQuery } from "./chatGroupMemember.sql";
import { QUERY_PAGINATION } from "../../util/consts";

interface ISaveChatGroupMember {
  userId: GroupMemberModel["userId"];
  isAdmin?: GroupMemberModel["isAdmin"]
}

interface IChatGroupMembers {
  data: GroupMemberModel[];
  pageSize: number;
  page: number;
  total: number;
}

interface IChatGroupModelQuery {
  saveAll(groupId: GroupMemberModel["groupId"], members: ISaveChatGroupMember[]): Promise<boolean>;
  save(groupId: GroupMemberModel["groupId"], member: ISaveChatGroupMember): Promise<boolean>;
  getAll(groupId: GroupMemberModel["groupId"], userId: GroupMemberModel["userId"], page: number, pageSize?: number): Promise<IChatGroupMembers | undefined>;
  getTotal(groupId: GroupMemberModel["groupId"]): Promise<number>
  isAdmin(groupId: GroupMemberModel["groupId"], userId: GroupMemberModel["userId"]): Promise<boolean>;
  makeAdmin(groupId: GroupMemberModel["groupId"], userId: GroupMemberModel["userId"], makeAdmin: boolean): Promise<boolean>;
}

class ChatGroupMemberQuery implements IChatGroupModelQuery {

  public async saveAll(groupId: GroupMemberModel["groupId"], members: ISaveChatGroupMember[]): Promise<boolean> {
    const placeholders = members.map(() => "(?, ?, ?)").join(", ");
    // Flatten the array of values
    // (documentId, sharedWithUserId, permissions)
    const values = members.flatMap(user => [groupId, user.userId, user?.isAdmin ? true : false]);
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        SaveGroupAllMemberQuery(placeholders),
        values,
        async (err, result) => {
          if (err) {
            logger.fatal(err, err.message)
            reject(false)
          } else {
            const fileId = result.affectedRows;
            logger.info({createdUserId: fileId}, `added members: ${members.map(a => a.userId).join(", ")}  to groupId ${groupId}`)
            if (fileId) {
              resolve(true)
            } else {
              reject(false)
            }
          }
        }
      );
    });
  }

  public async save(groupId: GroupMemberModel["groupId"], member: ISaveChatGroupMember): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        SaveGroupMemberQuery,
        [groupId, member.userId, member?.isAdmin ? true : false],
        async (err, result) => {
          if (err) {
            logger.fatal(err.message)
            reject(err)
          } else {
            const fileId = result.insertId;
            logger.info({createdUserId: fileId}, `member : ${member.userId} added in groupId ${groupId}`)
            if (fileId) {
              resolve(true)
            } else {
              reject("Something went wrong! document not shared")
            }
          }
        }
      )
    });
  }

  public async getAll(groupId: GroupMemberModel["groupId"], userId: GroupMemberModel["userId"], page: number, pageSize?: number): Promise<IChatGroupMembers | undefined> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * (pageSize || QUERY_PAGINATION);
      pool.query<GroupMemberModel[]>(
        GetAllGroupMembers,
        [groupId, userId, pageSize || QUERY_PAGINATION, offset],
        async (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result;
            if (!data) {
              reject(`group: ${groupId} member Not Fond`);
              logger.info(`group: ${groupId} member Not Fond`);
            }
            try {
              const total = await this.getTotal(groupId)
              const queryResponse: IChatGroupMembers = {
                data: result,
                page: page,
                pageSize: pageSize || QUERY_PAGINATION,
                total: total,
              }
              logger.info(result, `found members for groupId: ${groupId}`)
              resolve(queryResponse)
            } catch (error) {
              reject({message: `Error while getting members for groupId: ${groupId}`, error})
            }
          }
        }
      )
    });
  }

  public async getTotal(groupId: GroupMemberModel["groupId"]): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query(
        getTotalMember,
        [groupId],
        (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result;
            if (!data) {
              reject("Members Not Fond");
              logger.info("Members Not Found")
            }
            resolve(data[0]?.total || 0)
          }
        }
      )
    });
  }

  public async isAdmin(groupId: GroupMemberModel["groupId"], userId: GroupMemberModel["userId"]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader[]>(
        isAdminQuery,
        [groupId, userId],
        (err, result) => {
          if (result.length > 0) {
            logger.info("Admin", result)
            resolve(true)
          }
          logger.fatal(err)
          reject("Not Admin")
        }
      )
    })
  }

  public async makeAdmin(groupId: GroupMemberModel["groupId"], userId: GroupMemberModel["userId"], makeAdmin: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader[]>(
        makeAdminQuery,
        [makeAdmin, groupId, userId],
        (err, result) => {
          if (result.length > 0) {
            logger.info("Admin", result)
            resolve(true)
          }
          logger.fatal(err)
          reject("Not A Member")
        }
      )
    })
  }
}

export default new ChatGroupMemberQuery();
