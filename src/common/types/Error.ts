export type ExplorerError = Error & {
  digest?: string;
  status?: number;
  clone?: () => { json?: () => Promise<{ error?: string }> };
};
