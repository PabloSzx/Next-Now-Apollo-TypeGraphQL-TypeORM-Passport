import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
  @Field(_type => ID)
  @PrimaryColumn()
  email: string;

  @Field()
  @Column({ default: "Default" })
  name: string;

  @Field()
  @Column({ nullable: false })
  password: string;

  @Field()
  @Column({ default: false })
  admin: boolean;
}
