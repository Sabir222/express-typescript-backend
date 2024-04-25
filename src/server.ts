import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

const app: Application = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const origins = String(process.env.CORS_ORIGIN).split(",");
    if (!origin || origins.includes(String(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed."), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World ");
});

app.listen(PORT, () => {
  console.log(
    `Server running at ${process.env.SCHEME}://${process.env.HOST}:${process.env.PORT}`
  );
});
