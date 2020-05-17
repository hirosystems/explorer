export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;
