import express, {Request, Response} from "express";
import cors from "cors";
import { routes, wsRoute } from "./router/routes";
import env from "./env";
import { UserAuthenticate, UserAuthenticateWS } from "./middleware";
import { createServer } from "http";
import { Server } from "socket.io";
// import { HTTPResponse, HttpStatus } from "./httpResponse";

const app = express();

// use json for API routes
app.use(express.json());
// cors for api address/port
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"]
}));
app.use(UserAuthenticate)
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization"],
    credentials: true
  }
});

io.use(UserAuthenticateWS)
wsRoute(io)
// app.use((_: Request, res: Response) => {
//   res.status(404).send(
//     new HTTPResponse({statusCode: HttpStatus.NOT_FOUND.code, httpStatus: HttpStatus.NOT_FOUND.status, message: "path not found"})
//   ).json({ message: "Not Found" });
// });
// import routes from router
routes(app);

app.get("/", (req: Request, res: Response) => {
  console.log(req)
  res.send("INFO :: Root route called");
});

httpServer.listen(env.EXPRESS_PORT ,async () => {
  // await getDatabase();
  console.log("INFO :: Webserver started on port " + env.EXPRESS_PORT);
});
