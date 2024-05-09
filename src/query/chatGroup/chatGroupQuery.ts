import { ResultSetHeader } from "mysql2";
import pool from "../../database";
import logger from "../../../logger";
import ChatGroupModel from "../../model/chatGroupModel";
import { GetAllGroupsForUser, GetGroupByMember, GetGroupQuery, GetTotalGroupsForUser, SaveGroupQuery } from "./chatGroup.sql";
import { ChatGroupMememberQuery } from "../../query";
import { QUERY_PAGINATION } from "../../util/consts";

interface ISaveChatGroup {
  name: ChatGroupModel["name"];
  description?: ChatGroupModel["description"];
  profileImageUrl?: ChatGroupModel["profileImageUrl"];
  members?: ChatGroupModel["adminId"][];
}

interface IAllUserGroups {
  data: ChatGroupModel[];
  pageSize: number;
  page: number;
  total: number;
}

interface IChatGroupModelQuery {
  save(adminId: ChatGroupModel["adminId"], groupDetails: ISaveChatGroup): Promise<ChatGroupModel>;
  get(groupId: ChatGroupModel["groupId"]): Promise<ChatGroupModel | undefined>;
  getAllUserGroup(userId: ChatGroupModel["adminId"], page: number, pageSize?: number, query?: string): Promise<IAllUserGroups | undefined>;
  getTotal(userId: ChatGroupModel["adminId"]): Promise<number>;
  getUserGroupByMember(groupId: ChatGroupModel["groupId"], userId: ChatGroupModel["adminId"]): Promise<ChatGroupModel | undefined>;
  // getDocuments(ownerId: DocumentModel["ownerId"], page: number, pageSize: number): Promise<IGetDocuments>;
  // getTotal(ownerId: DocumentModel["ownerId"]): Promise<number>;
  // deleteDocument(fileId: DocumentModel["fileId"], ownerId: DocumentModel["ownerId"], deletedBy: DocumentModel["ownerId"]): Promise<number>;
  // update(ownerId: DocumentModel["ownerId"], payload: IUpdateDocuments): Promise<number>;
  // delete(userId: DocumentModel["userId"]): Promise<number>;
  // hardDelete(userId: DocumentModel["userId"]): Promise<number>;
  // deleteAll(): Promise<number>;
}

class ChatGroupQuery implements IChatGroupModelQuery {

  public async save(adminId: ChatGroupModel["adminId"], groupDetails: ISaveChatGroup): Promise<ChatGroupModel> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        SaveGroupQuery,
        [adminId, groupDetails.name, groupDetails?.description, groupDetails?.profileImageUrl],
        async (err, result) => {
          if (err) {
            logger.fatal(err.message)
            reject(err)
          } else {
            const groupId = result.insertId;
            logger.info({createdChatGroupId: groupId}, "group created")
            //# region create member
            const members = groupDetails?.members || []
            // add creater as admin member
            const allMemberToAdd = [
              {userId: adminId, isAdmin: true},
              ...members.map(id => {
                return {userId: id, isAdmin: id === adminId}
              })
            ]
            const isAdded = await ChatGroupMememberQuery.saveAll(groupId, allMemberToAdd)
            // if not added delete the group
            if (isAdded) {
              logger.info("all added")
            } else {
              logger.fatal("NEED TO DELETE GROUP BECAUSE MEMBER NOT CREATED")
              reject({message: "Member not created"})
            }
            //# endregin
            const group = await this.get(groupId)
            if (group) {
              resolve(group)
            } else {
              reject("Something went wrong! groupDetails not created")
            }
          }
        }
      );
    });
  }

  public async get(groupId: ChatGroupModel["groupId"]): Promise<ChatGroupModel | undefined> {
    return new Promise((resolve, reject) => {
      pool.query<ChatGroupModel[]>(
        GetGroupQuery,
        [groupId],
        (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result[0];
            if (!data) {
              reject("group Not Fond");
              logger.info("group Not Found")
            }
            logger.info(data, "found group")
            resolve(data)
          }
        }
      )
    });
  }

  public async getAllUserGroup(userId: ChatGroupModel["userId"], page: number, pageSize?: number, query?: string): Promise<IAllUserGroups| undefined> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * (pageSize || QUERY_PAGINATION);
      pool.query<ChatGroupModel[]>(
        GetAllGroupsForUser,
        [userId, query, pageSize || QUERY_PAGINATION, offset],
        async (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result;
            if (!data) {
              reject(`no groups group for userId: ${userId}`);
              logger.info(`no groups group for userId: ${userId}`);
            }
            try {
              const total = await this.getTotal(userId)
              const queryResponse: IAllUserGroups = {
                data: result,
                page: page,
                pageSize: pageSize || QUERY_PAGINATION,
                total: total,
              }
              logger.info(result, `found groups for userId: ${userId}`)
              resolve(queryResponse)
            } catch (error) {
              reject({message: `Error while getting groups for userId: ${userId}`, error})
            }
          }
        }
      )
    })
  }

  getUserGroupByMember(groupId: ChatGroupModel["groupId"], userId: ChatGroupModel["adminId"]): Promise<ChatGroupModel | undefined> {
    return new Promise((resolve, reject) => {
      pool.query<ChatGroupModel[]>(
        GetGroupByMember,
        [groupId, userId],
        async (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            resolve(result[0])
            if (result.length < 0) {
              reject(`no groups group for userId: ${userId}`);
              logger.info(`no groups group for userId: ${userId}`);
            }
          }
        }
      )
    })
  }

  public async getTotal(userId: ChatGroupModel["adminId"]): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query(
        GetTotalGroupsForUser,
        [userId],
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
}

export default new ChatGroupQuery();
