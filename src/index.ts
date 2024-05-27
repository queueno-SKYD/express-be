import express, {Request, Response} from "express";
import cors from "cors";
import { routes, wsRoute } from "./router/routes";
import env from "./env";
import { UserAuthenticate } from "./middleware";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { getDatabase } from "./databasePS";
// import { HTTPResponse, HttpStatus } from "./httpResponse";

const app = express();

// use json for API routes
app.use(express.json());
// cors for api address/port
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"]
}));

app.use("../uploads", express.static(path.join(__dirname, "uploads")));

app.get("/uploads/:fileId", (req, res) => {
  const fileId = req.params.fileId;
  const uploadsDir = path.join(__dirname, "..", "uploads");
  const filePath = path.join(uploadsDir, fileId);
  // Serve the file from the uploads directory
  res.sendFile(filePath);
});

app.get("/uploads/images/:fileId", (req, res) => {
  const fileId = req.params.fileId;
  const uploadsDir = path.join(__dirname, "..", "uploads", "images");
  const filePath = path.join(uploadsDir, fileId);
  // Serve the file from the uploads directory
  res.sendFile(filePath);
});

app.get("/uploads/media/:fileId", (req, res) => {
  const fileId = req.params.fileId;
  const uploadsDir = path.join(__dirname, "..", "uploads", "media");
  const filePath = path.join(uploadsDir, fileId);
  // Serve the file from the uploads directory
  res.sendFile(filePath);
});

app.get("/uploads/others/:fileId", (req, res) => {
  const fileId = req.params.fileId;
  const uploadsDir = path.join(__dirname, "..", "uploads", "others");
  const filePath = path.join(uploadsDir, fileId);
  // Serve the file from the uploads directory
  res.sendFile(filePath);
});

app.use(UserAuthenticate)
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization"],
    credentials: true
  }
});

// io.use(UserAuthenticateWS)
wsRoute(io)

routes(app);

app.get("/", (req: Request, res: Response) => {
  console.log(req)
  res.send("INFO :: Root route called");
});

httpServer.listen(env.EXPRESS_PORT ,async () => {
  getDatabase();
  console.log("INFO :: Webserver started on port " + env.EXPRESS_PORT);
});
