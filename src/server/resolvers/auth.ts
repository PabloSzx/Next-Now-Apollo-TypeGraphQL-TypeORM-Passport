import { IsEmail, Length } from "class-validator";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { User } from "../entities";
import { IContext } from "../interfaces";
import { WRONG_PASSWORD } from "../middleware";

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(3, 100)
  password: string;
}

@InputType()
export class SignUpInput extends LoginInput {
  @Field({ nullable: true, defaultValue: "Default" })
  name: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>
  ) {}

  @Query(_returns => User, { nullable: true })
  async current_user(@Ctx() { isAuthenticated, user }: IContext) {
    if (isAuthenticated()) {
      return user;
    }
  }

  @Mutation(_returns => User, { nullable: true })
  async login(
    @Arg("input") { email, password }: LoginInput,
    @Ctx() { login }: IContext
  ) {
    try {
      const user = await this.UserRepository.findOne(email);

      if (user) {
        if (user.password !== password) {
          throw new Error(WRONG_PASSWORD);
        } else {
          await login(user);
        }
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  @Mutation(_returns => Boolean)
  logout(@Ctx() { logout, isAuthenticated }: IContext) {
    if (isAuthenticated()) {
      logout();
      return true;
    }
    return false;
  }

  @Mutation(_returns => User, { nullable: true })
  async sign_up(
    @Arg("input") { email, password, name }: SignUpInput,
    @Ctx() { login }: IContext
  ) {
    try {
      if (!this.UserRepository.findOne(email)) {
        const user = await this.UserRepository.create({
          email,
          password,
          name,
        });
        await Promise.all([login(user), this.UserRepository.save(user)]);

        return user;
      }
      throw new Error("USER_ALREADY_EXISTS");
    } catch (err) {
      throw err;
    }
  }
}
