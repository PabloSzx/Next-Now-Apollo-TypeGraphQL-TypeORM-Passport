import { toInteger } from "lodash";
import { Container } from "typedi";
import {
    Connection, ConnectionOptions, createConnection, getConnectionManager, useContainer
} from "typeorm";

import { User } from "../entities/user";

const dbConfig: ConnectionOptions = {
  type: "postgres",
  entities: [User],
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME || "postgres",
  port: toInteger(process.env.DB_PORT) || 5432,
  synchronize: true,
  logging: true,
};
useContainer(Container);

export const connection = new Promise<Connection>(async (resolve, reject) => {
  try {
    return await createConnection(dbConfig);
  } catch (err) {
    // If AlreadyHasActiveConnectionError occurs, return already existent connection
    if (err.name === "AlreadyHasActiveConnectionError") {
      const existentConn = getConnectionManager().get("default");
      return existentConn;
    }
    throw err;
  }
});

// export const connection = createConnection(dbConfig);
