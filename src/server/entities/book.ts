import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Book {
  @Field()
  title!: string;

  @Field()
  author!: string;
}
