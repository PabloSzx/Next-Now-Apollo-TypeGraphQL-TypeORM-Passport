import { Request } from "express";

import { User } from "../entities";

const promisifiedLogin = <T = any, S = any>(
  req: Request,
  user: T,
  options: S
) =>
  new Promise((resolve, reject) =>
    req.login(user, options, err => {
      if (err) reject(err);
      else resolve();
    })
  );

export const buildContext = <OptionsType = any>({ req }: { req: Request }) => {
  return {
    login: (user: User, options?: OptionsType) =>
      promisifiedLogin(req, user, options),
    logout: () => {
      if (req.session) {
        req.session.destroy(() => {});
      }
      req.logout();
    },
    isAuthenticated: () => req.isAuthenticated(),
    isUnauthenticated: () => req.isUnauthenticated(),
    get user(): User {
      return req.user;
    },
  };
};
