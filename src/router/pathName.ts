const version = "v1";
export const PathName = {
  Login: `/api/${version}/login`,
  Register: `/api/${version}/register`,
  Me: `/api/${version}/me`,
  AllUsers: `/api/${version}/manageUsers/getAllUsers`,
  DeleteUserByAdmin: `/api/${version}/manageUsers/deleteUserByAdmin`,
  uploadDocument: `/api/${version}/manageDocs/uploadDocument`,
  getDocument: `/api/${version}/manageDocs/getDocument`,
  getDocuments: `/api/${version}/manageDocs/getDocuments`,
  EditUsersByAdmin: `/api/${version}/manageUsers/editUserByAdmin`,
  NotFound: "/*",
};

export const PublicRoute = [PathName.Login, PathName.Register];
