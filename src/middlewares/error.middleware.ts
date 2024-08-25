/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Possible error names
const errorNames = [
  "CastError",
  "JsonWebTokenError",
  "ValidationError",
  "SyntaxError",
  "TokenExpiredError",
];

import type { Application, Request, Response, NextFunction } from "express";
import response from "../utils/response";

export default (app: Application) => {
  app.use("*", (req: Request, res: Response) => {
    res.status(404).end();
  });
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.name == "CustomError") {
      res.status(error.status).send(response(error.message, null, false));
    } else if (error.name === "TokenExpiredError") {
      res.status(403).send(response("Invalid or expired token", null, false));
    } else if (error.name === "JsonWebTokenError") {
      res.status(403).send(response("Invalid or expired token", null, false));
    } else if (errorNames.includes(error.name)) {
    } else if (error.status === 413) {
      res.status(413).send(response("Entity too large", null, false));
    } else {
      res.status(500).send(response(error.message, null, false));
    }
  });

  return app;
};
