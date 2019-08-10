import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import { resolve } from "path";
import { buildSchemaSync } from "type-graphql";
import { Container as container } from "typedi";

import { authChecker } from "./authChecker";
import { buildContext } from "./buildContext";

const resolverPath = resolve(__dirname, "../graphql/resolvers/*.js");

const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [resolverPath],
    validate: false,
    skipCheck: true,
    container,
    authChecker,
  }),
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
  context: ({ req }) => buildContext({ req }),
});

export const apollo = (app: Express) => {
  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql",
  });
};
