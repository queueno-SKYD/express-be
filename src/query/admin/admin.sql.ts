
/** Update delete flag by admin  */
export const DeleteUserByAdmin = (userIds : number[]) => `
  update USER_TABLE set deleted = 1 , deleteBy = ? where userId in (${userIds.join()});
`;
