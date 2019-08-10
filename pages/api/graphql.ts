import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchemaSync } from "type-graphql";

import { connection } from "../../src/server/db";
import { BookResolver, UserResolver } from "../../src/server/graphql";
import common from "../../src/server/middleware/common";
import auth from "../../src/server/middleware/passport";

const app = express();

app.use(common);
app.use(auth);

const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver, BookResolver],
    validate: false,
    skipCheck: true,
  }),
  playground:
    process.env.NODE_ENV !== "production"
      ? {
          settings: {
            "request.credentials": "include",
          },
        }
      : false,
});

app.use(async (_req, _res, next) => {
  await connection;
  next();
});

apolloServer.applyMiddleware({
  app,
  path: "/api/graphql",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
