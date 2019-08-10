import { Container } from "typedi";
import { ConnectionOptions, createConnection, useContainer } from "typeorm";

import { User } from "../entities/user";

const dbConfig: ConnectionOptions = {
  type: "postgres",
  entities: [User],
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME || "postgres",
  port: parseInt(process.env.DB_PORT || "") || 5432,
  synchronize: true,
  logging: true,
};

useContainer(Container);

export const connection = createConnection(dbConfig);
