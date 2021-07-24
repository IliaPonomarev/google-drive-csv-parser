export interface IDBConfig {
  connectionUrl: string;
}

export interface IDB {
  connect();
  close(): Promise<void>;
}