export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const IS_DEV = process.env.NODE_ENV !== 'production';
