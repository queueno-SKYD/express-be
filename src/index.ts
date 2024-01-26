import express, {Request, Response} from "express";
import cors from "cors";
import { routes } from "./routes";

const expressPort = 3001;
const app = express();
// use json for API routes
app.use(express.json());
// cors for api address/port
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"]
}));

// import routes from router
routes(app);

app.get("/", (req: Request, res: Response) => {
  res.send("INFO :: Root route called");
});

app.listen(expressPort, () => {
  console.log("INFO :: Webserver started on port " + expressPort);
});
