const version = "v1";
export const PathName = {
  Login: `/api/${version}/login`,
  Register: `/api/${version}/register`,
  Me: `/api/${version}/me`,
  AllUsers: `/api/${version}/manageUsers/getAllUsers`,
  DeleteUserByAdmin: `/api/${version}/manageUsers/deleteUserByAdmin`,
  NotFound: "/*",
};

export const PublicRoute = [PathName.Login, PathName.Register];
