import express, {Request, Response} from "express";
import cors from "cors";
import { routes } from "./router/routes";
import env from "./env";
import { UserAuthenticate } from "./middleware";
import path from "path";
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

app.use(UserAuthenticate)

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

app.listen(env.EXPRESS_PORT ,async () => {
  // await getDatabase();
  console.log("INFO :: Webserver started on port " + env.EXPRESS_PORT);
});
