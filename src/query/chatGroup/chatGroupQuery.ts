import { ResultSetHeader } from "mysql2";
import pool from "../../database";
import logger from "../../../logger";
import ChatGroupModel from "../../model/chatGroupModel";
import { GetGroupQuery, SaveGroupQuery } from "./chatGroup.sql";

interface ISaveChatGroup {
  name: ChatGroupModel["name"];
  description?: ChatGroupModel["description"];
  profileImageUrl?: ChatGroupModel["profileImageUrl"];
  members?: [ChatGroupModel["adminId"]]
}

interface IChatGroupModelQuery {
  save(adminId: ChatGroupModel["adminId"], groupDetails: ISaveChatGroup): Promise<ChatGroupModel>;
  get(groupId: ChatGroupModel["groupId"]): Promise<ChatGroupModel | undefined>;
  // getDocuments(ownerId: DocumentModel["ownerId"], page: number, pageSize: number): Promise<IGetDocuments>;
  // getTotal(ownerId: DocumentModel["ownerId"]): Promise<number>;
  // deleteDocument(fileId: DocumentModel["fileId"], ownerId: DocumentModel["ownerId"], deletedBy: DocumentModel["ownerId"]): Promise<number>;
  // update(ownerId: DocumentModel["ownerId"], payload: IUpdateDocuments): Promise<number>;
  // delete(userId: DocumentModel["userId"]): Promise<number>;
  // hardDelete(userId: DocumentModel["userId"]): Promise<number>;
  // deleteAll(): Promise<number>;
}

class ChatGroupQuery implements IChatGroupModelQuery {

  public async save(adminId: ChatGroupModel["adminId"], document: ISaveChatGroup): Promise<ChatGroupModel> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        SaveGroupQuery,
        [adminId, document.name, document?.description, document?.profileImageUrl],
        async (err, result) => {
          if (err) {
            logger.fatal(err.message)
            reject(err)
          } else {
            const groupId = result.insertId;
            logger.info({createdChatGroupId: groupId}, "group created")
            // create member
            const groupDetails = await this.get(groupId)
            if (groupDetails) {
              resolve(groupDetails)
            } else {
              reject("Something went wrong! document not created")
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
}

export default new ChatGroupQuery();
