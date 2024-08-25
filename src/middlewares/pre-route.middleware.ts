import helmet from "helmet";
import express from "express";
import type { Application } from "express";
import compression from "compression";
import { stream } from "../utils/logger";
import morgan from "morgan";

export default (app: Application) => {
  app.set("trust proxy", 1);
  app.use(
    compression({
      level: 6,
      threshold: 0,
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );

  app.use(helmet({ contentSecurityPolicy: false }));

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("combined", { stream }));
  return app;
};
