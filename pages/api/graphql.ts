import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchemaSync, Query, Resolver } from "type-graphql";

import { Book } from "../../src/server/graphql";

const app = express();

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
  },
];

@Resolver(_of => Book)
class BookResolver {
  @Query(_returns => [Book])
  books() {
    return books;
  }
}

const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [BookResolver],
    validate: false,
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
