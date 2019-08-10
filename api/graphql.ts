import "reflect-metadata";

import express from "express";

import { apollo, auth, common, connection } from "../src/server";

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
