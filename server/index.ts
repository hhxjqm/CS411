import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import "dotenv/config";
import { loggerMiddleware, logger } from "./utils/logger";
import path from "path";

import user from "./routes/user";
import group from "./routes/group";
import transaction from "./routes/transaction";
import exchange from "./routes/exchange";
import spending from "./routes/spending";

const app = express();

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err);
  res.status(500).send("Something went wrong");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(errorHandler);

app.use("/user", user);
app.use("/group", group);
app.use("/transaction", transaction);
app.use("/exchange", exchange);
app.use("/spending", spending);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "..", "web_app", "dist")));
  app.use((req, res) => {
    res.header("Content-Type", "text/html");
    res.header("Cache-Control", "no-cache");
    res.sendFile(
      path.join(__dirname, "..", "..", "web_app", "dist", "index.html")
    );
  });
} else {
  app.use((req, res) => {
    res.status(404).send("Not found");
  });
}

app.listen(3000, () => {
  logger.info("Server is running on http://localhost:3000");
});
