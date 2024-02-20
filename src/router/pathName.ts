const version = "v1";
export const PathName = {
  Login: `/api/${version}/login`,
  Register: `/api/${version}/register`,
  Me: `/api/${version}/me`,
  AllUsers: `/api/${version}/manageUsers/getAllUsers`,
  DeleteUserByAdmin: `/api/${version}/manageUsers/deleteUserByAdmin`,
  searchUsers: `/api/${version}/manageUsers/search`,
  uploadDocument: `/api/${version}/manageDocs/uploadDocument`,
  getDocument: `/api/${version}/manageDocs/getDocument`,
  getDocuments: `/api/${version}/manageDocs/getDocuments`,
  deleteDocument: `/api/${version}/manageDocs/deleteDocument`,
  editDocument: `/api/${version}/manageDocs/editDocument`,
  shareDocument: `/api/${version}/manageDocs/share`,
  shareWithMultipleUsers: `/api/${version}/manageDocs/shareWithMultipleUsers`,
  getShareDetails: `/api/${version}/manageDocs/getShareDetails`,
  revokeShare: `/api/${version}/manageDocs/revokeShare`,
  getSharedDocumentByOthers: `/api/${version}/manageDocs/getSharedDocumentByOthers`,
  CreateGroup: `/api/${version}/chatService/createGroup`,
  EditUsersByAdmin: `/api/${version}/manageUsers/editUserByAdmin`,
  NotFound: "/*",
};

export const PublicRoute = [PathName.Login, PathName.Register];
