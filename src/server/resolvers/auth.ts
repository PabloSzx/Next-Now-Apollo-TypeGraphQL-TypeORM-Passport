import { IsEmail, Length } from "class-validator";
import { SHA512 } from "crypto-js";
import { Args, ArgsType, Ctx, Field, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { USER_ALREADY_EXISTS, WRONG_INFO } from "../consts";
import { User } from "../entities";
import { IContext } from "../interfaces";

@ArgsType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(3, 100)
  password: string;
}

@ArgsType()
export class SignUpInput extends LoginInput {
  @Field({ nullable: true, defaultValue: "Default" })
  name: string;

  @Field({ nullable: true, defaultValue: false })
  admin: boolean;
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
    @Args() { email, password }: LoginInput,
    @Ctx() { login }: IContext
  ) {
    try {
      const user = await this.UserRepository.findOne({
        where: {
          email,
        },
      });

      password = SHA512(password).toString();
      if (user) {
        if (user.password !== password) {
          throw new Error(WRONG_INFO);
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
    @Args() { email, password, name, admin }: SignUpInput,
    @Ctx() { login }: IContext
  ) {
    try {
      if (
        !(await this.UserRepository.findOne({
          where: { email },
        }))
      ) {
        password = SHA512(password).toString();

        const user = await this.UserRepository.create({
          email,
          password,
          name,
          admin,
        });

        await this.UserRepository.save(user);
        await login(user);

        return user;
      } else throw new Error(USER_ALREADY_EXISTS);
    } catch (err) {
      throw err;
    }
  }
}
