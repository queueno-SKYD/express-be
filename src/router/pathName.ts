const version = "v1";
export const PathName = {
  Login: `/api/${version}/login`,
  Register: `/api/${version}/register`,
  Me: `/api/${version}/me`,
  NotFound: `/*`,
};

export const PublicRoute = [PathName.Login, PathName.Register,PathName.NotFound];
