import express from "express";
import config from "config";
import log from "./logger";
import connect from "./db/connect";
import routes from "./routes";
import { deserializeUser } from "./middleware";
import swaggerDocs from "./utils/swagger";
import cors from "cors";

const port: any = process.env.PORT || config.get("port") as number;
const host = config.get("host") as string;

const app = express();
app.use(cors());
app.use(deserializeUser);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  log.info(`Server listing at http://${host}:${port}`);

  connect();

  routes(app);

  swaggerDocs(app, port);
});
