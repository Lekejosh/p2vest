import { Request, Response, Router } from "express";

import v1 from "./v1";
import client from "../config/database/redis";
import model from "../config/database";

const router = Router();

router.use("/v1", v1);

router.get("/health", async (req: Request, res: Response) => {
  const ques = await model.$executeRaw`SELECT * FROM User`;
  const redis = await client.ping();
  if (redis && ques) {
    return res.status(200).send("All system online");
  }

  return res.status(400).end();
});

router.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({
    status: true,
    message: "You probably shouldn't be here, but...",
    data: {
      service: "p2vest-api",
      class: "public",
      version: "1.0",
    },
  });
});
export default router;
