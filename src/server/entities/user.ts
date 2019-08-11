import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column({ default: "Default" })
  name: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ default: false })
  admin: boolean;
}
