import http from "http";
import { app } from "./app";
import model from "./config/database";
import { port } from "./config";

const httpServer = http.createServer(app);
const start = async () => {
  await model.$connect();
  httpServer.listen(port, async () => {
    console.log(`:::> 🚀 Server ready at http://localhost:${port}`);
  });
};

start();
