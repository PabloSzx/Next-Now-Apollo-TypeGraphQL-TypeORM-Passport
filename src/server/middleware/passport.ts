import { Router } from "express";
import ExpressSession from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

import { connection } from "../db";
import { User } from "../entities";

export const WRONG_PASSWORD = "WRONG_PASSWORD";
export const WRONG_EMAIL = "WRONG_EMAIL";

export const auth = Router();
auth.use(
  ExpressSession({
    secret: "tF47Oz#R$v2oCT&gooX%QclBNF$E8OosV^vBebkYVro8$5DB1a",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 86400000, secure: false },
  })
);

auth.use(passport.initialize());
auth.use(passport.session());

passport.use(
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      try {
        const UserRepository = (await connection).getRepository(User);

        const user = await UserRepository.findOne(email);

        if (!user) {
          return cb(WRONG_EMAIL, false);
        }
        if (user.password !== password) {
          return cb(WRONG_PASSWORD, false);
        }

        return cb(null, user);
      } catch (err) {
        console.error(err);
      }
    }
  )
);

passport.serializeUser<User, string>((user, cb) => {
  if (user) cb(null, user.email);
  else cb(WRONG_EMAIL);
});

passport.deserializeUser<User, string>(async (email, done) => {
  try {
    const UserRepository = (await connection).getRepository(User);

    const user = await UserRepository.findOne(email);

    if (user) {
      done(null, user);
    } else {
      done(WRONG_EMAIL);
    }
  } catch (err) {
    console.error(JSON.stringify(err, null, 4));
  }
});

const requireAuth = Router();
requireAuth.use(auth, (req, res, next) => {
  if (req.user && req.user.email) {
    return next();
  } else {
    res.sendStatus(403);
  }
});

export { requireAuth };
