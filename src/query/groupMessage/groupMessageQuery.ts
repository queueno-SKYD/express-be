import pool from "../../database";
import GroupMessageModel, { GroupMessageInput, GroupMessageResponseModel } from "../../model/groupMessageModel";

import { ResultSetHeader } from "mysql2";
import logger from "../../../logger";
import { createGroupMessageQuery, getMessageQuery, getGroupMessagesQuery } from "./groupMessageQuery.sql";
import { QUERY_PAGINATION } from "../../util/consts";

interface IGetGroupMessages {
  data: GroupMessageResponseModel[];
  pageSize: number;
  page: number;
}

interface IGroupMessageModalQuery {
  save(input:GroupMessageInput): Promise<GroupMessageModel["messageId"]>;
  get(messageId: GroupMessageModel["messageId"]): Promise<GroupMessageModel | null>;
  getGroupMessages(groupId: GroupMessageModel["recipientId"], userId: GroupMessageModel["senderId"], page: number, pageSize?: number): Promise<IGetGroupMessages>;
}

class GroupMessageModalQuery implements IGroupMessageModalQuery {
  public async save(input:GroupMessageInput): Promise<GroupMessageModel["messageId"]> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        createGroupMessageQuery,
        [input.senderId, input.recipientId, input.messageContentId, input.message, input.sendAt],
        async (err, result) => {
          if (err) {
            logger.fatal(err.message)
            reject(err)
          } else {
            const messageId = result.insertId;
            if (messageId) {
              resolve(messageId)
            } else {
              reject("Something went wrong! document not created check GroupMessageModalQuery.save method")
            }
          }
        }
      )
    });
  }

  public async get(messageId: GroupMessageModel["messageId"]): Promise<GroupMessageModel | null> {
    return new Promise((resolve, reject) => {
      pool.query<GroupMessageModel[]>(
        getMessageQuery,
        [messageId],
        (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result[0];
            if (!data) {
              reject("Message Not Fond");
              logger.info("Message Not Found")
            }
            resolve(data)
          }
        }
      )
    });
  }

  public async getGroupMessages(groupId: GroupMessageModel["recipientId"], userId: GroupMessageModel["senderId"], page: number, pageSize?: number): Promise<IGetGroupMessages> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * (pageSize || QUERY_PAGINATION);
      pool.query<GroupMessageResponseModel[]>(
        getGroupMessagesQuery,
        [groupId, userId, pageSize || QUERY_PAGINATION, offset],
        async (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result;
            if (!data) {
              reject("messages Not Fond");
              logger.info("messages Not Found")
            }
            const queryResponse: IGetGroupMessages = {
              data: result,
              page: page,
              pageSize: pageSize || QUERY_PAGINATION,
            }
            logger.info("messages found")
            resolve(queryResponse)
          }
        }
      )
    });
  }
}

export default new GroupMessageModalQuery();
