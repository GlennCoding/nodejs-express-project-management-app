import express from "express";
import { config } from "./config";
import authRoutes from "./routes/auth.router";

const app = express();
const port = config.port;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.use(authRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
