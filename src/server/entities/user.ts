import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
  @Field(_type => ID)
  @PrimaryColumn()
  email: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  password: string;
}
