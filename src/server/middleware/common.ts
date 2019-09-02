import { Router } from "express";
import morgan from "morgan";

export const common = Router();

common.use(
  morgan("combined", {
    skip: (req, res) => {
      if (req.url.match(/(?=\/_next\/.*)/)) {
        return true;
      }
      if (req.originalUrl.match(/\/api\/graphql/) && res.statusCode === 200) {
        return true;
      }
      return false;
    },
  })
);
