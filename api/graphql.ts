import "reflect-metadata";

import express from "express";

import { connection } from "../src/server/db";
import { auth, common } from "../src/server/middleware";
import { apollo } from "../src/server/utils";

const app = express();

app.use(common);

app.use(async (_req, _res, next) => {
  await connection;
  next();
});

app.use(auth);

apollo(app);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
