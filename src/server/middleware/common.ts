import { Router } from "express";
import morgan from "morgan";

const common = Router();

common.use(morgan("combined"));

export default common;
