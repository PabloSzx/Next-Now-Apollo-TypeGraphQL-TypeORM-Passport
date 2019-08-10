import { Query, Resolver } from "type-graphql";

import { Book } from "../entities";

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
export class BookResolver {
  @Query(_returns => [Book])
  books() {
    return books;
  }
}
