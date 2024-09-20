# First step : Express + typescript setup..

- Create your project repository on github.
- clone your repo and cd to it.
- Run `npm init -y`.

- generate tsconfig.json `npx tsc --init` and uncomment `"outDir": "./build"` ,`"rootDir": "./src"`.

### Install Dependencies.

```bash
npm i express
```

### Install Dev Dependencies.

```plaintext
npm i -D @types/express rimraf nodemon typescript ts-node
```

### Setup the scripts.

```json

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "rimraf ./build && tsc",
    "dev": "nodemon"
  },

```

### Create server.ts inside src folder in the rootDir.

```
├── src
│   ├── server.ts

```

basic server.

```typescript
import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World ");
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
```

### Add nodemon config.

- In RootDir add `nodemon.json`.

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": ["ts-node ./src/server.ts"]
}
```

### Run your script.

- `npm run dev`

```plaintext

sabir@sabirlinux:~/Desktop/express-typescript-backend$ npm run dev

> express-typescript-backend@1.0.0 dev
> nodemon ./src/server.ts

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node ./src/server.ts`
server running on port 5000

```

# Step two : Adding postgreSQL Database.

Using PostgreSQL in a Docker container makes it easy to set up and manage your database, and it works smoothly across different setups like development and production.

### Docker postgres setup.

- Go to docker hub and sign-up : [DockerHub](https://hub.docker.com/_/postgres).
- Login to docker-hub in your terminal by using `docker login` then enter username and pw or using [token](https://hub.docker.com/settings/security) docker login -u (username)` then enter your token.

To run a PostgreSQL container use the following command:

```bash
docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=MySecretPassword -d postgres
```

- `--name` to name it.
- `-p 5432:5432` Expose container's port 5432 to host's port 5432.
- `-e POSTGRES_PASSWORD=MySecretPassword ` Set the environment variable `POSTGRES_PASSWORD` to "MySecretPassword".
- `-d` Run the container in detached mode (`-d` flag).
- `postgres` what image we want to pull.

```
# List all Docker containers.
docker ps -a

# Start a Docker container named <docker container name>.
docker start <docker container name>

# Open a terminal within the Docker container named (express-typescript-postgres-docker).
sudo docker exec -it express-typescript-postgres-docker bash

# Access the PostgreSQL database.
psql -U postgres

# List all databases.
\l

# Connect to a specific database like 'backenddb'.
\c backenddb

```

### Link Database with the express App.

- Install pg and dotenv.

```
npm install pg dotenv
```

- Install pg types

```
npm i -D @types/pg
```

- Add db.ts to /src/config directory.

```typescript
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: process.env.DBPASSWORD,
  port: 5432,
});

export default pool;
```

> 📝 You can add a new database with different name other than the default one created with this command in docker terminal `CREATE DATABASE database_name;`.

- Add database schema.

```sql
# inside docker terminal
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255),
    hashed_password VARCHAR(255),
    created_at TIMESTAMP,
    role VARCHAR(50) DEFAULT 'user'
);
```

> 📝 You can use PgAdmin4 for easy database management. [PgAdmin](https://www.pgadmin.org/download/).

# Step three: Implementing Auth using JWT .

Before we start auth lets secure our app first with [cors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [helmet](https://blog.logrocket.com/using-helmet-node-js-secure-application/).

```
npm i cors helmet
```

```
npm i -D @types/cors
```

```typescript
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
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World ");
});

app.listen(PORT, () => {
  console.log(
    `🚀 Server ready at ${process.env.SCHEME}://${process.env.HOST}:${process.env.PORT}`
  );
});
```

### Adding auth routes.

- JWT Auth version using [prisma](https://roll-your-own-auth.vercel.app/jwt/server/express)

- file structure :

```
.
└── src/
    ├── config/
    │   └── db.ts
    ├── features/
    │   └── auth/
    │       ├── controllers/
    │       │   ├── loginController.ts
    │       │   ├── signUpController.ts
    │       │   ├── logOutController.ts
    │       │   ├── refreshController.ts
    │       │   └── meController.ts
    │       ├── routes/
    │       │   └── index.ts
    │       ├── validation/
    │       │   └── signUp.ts
    │       ├── middlewares/
    │       │   └── validate.ts
    │       └── utils/
    │           └── hashPassword.ts
    └── server.ts
```

 <!-- src/
       config/
           db.ts
       features/
           auth/
               controllers/
                 loginController.ts
                 signUpController.ts
                 logOutController.ts
                 refreshController.ts
                 meController.ts
             routes/
               index.ts
             validation/
               signUp.ts
             middlewares/
               validate.ts
            utils/
               hashPassword.ts
       server.ts -->

- Install auth dependencies.

```
npm i bcrypt zod cookie cookie-parser jsonwebtoken
```

```
npm i -D @types/bcrypt  @types/cookie @types/cookie-parser @types/jsonwebtoken
```

- .env file.

```json
# JWT
JWT_SECRET="" # Run `openssl rand -base64 32` in your CLI to generate a secret
JWT_REFRESH_SECRET="" # Run `openssl rand -base64 32` in your CLI to generate a secret
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=30d

# Server
NODE_ENV="development"
HOST="localhost"
SCHEME="http"
PORT="4000"
CORS_ORIGIN="http://localhost:3000,http://localhost:4000"

# Cookie
ACCESS_TOKEN_COOKIE_NAME=ChooseYourCookieName
REFRESH_TOKEN_COOKIE_NAME=ChooseYourCookieName_REFRESH
REFRESH_TOKEN_COOKIE_MAX_AGE=1800000
ACCESS_TOKEN_COOKIE_MAX_AGE=2592000000
```

- SignUp controller.

```typescript
// controllers/signupController.ts

import pool from "../../../config/db";
import { hashPassword } from "../../../utils/hashPassword";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const signUpController = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  console.log(`name: ${fullName} , email : ${email} and password:${password}`);

  const hashedPassword = hashPassword(password);

  try {
    if (!fullName || !email || !hashedPassword) {
      res.status(500).send("data missing try again please !");
      return;
    } else {
      const lowerCaseName = fullName.toLowerCase();
      const lowerCaseEmail = email.toLowerCase();
      const query = {
        text: "INSERT INTO users(full_name, email, hashed_password) VALUES($1, $2, $3) RETURNING user_id",
        values: [lowerCaseName, lowerCaseEmail, hashedPassword],
      };

      const result = await pool.query(query);
      const userId = result.rows[0].user_id;

      const access_token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      const refresh_token = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
      );

      res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME!, refresh_token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE),
      });

      res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME!, access_token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE),
      });

      return res.json({ access_token }).status(200);

      // res.status(201).send(`User added successfully`);
    }
  } catch (error) {
    res.status(500).json(error);
    return;
  }
};

export default signUpController;
```

- Login controller.

```typescript
// controllers/loginController.ts

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../../../config/db";
import { comparePassword } from "../../../utils/hashPassword";

const loginController = async (req: Request, res: Response) => {
  const { user_email, password } = req.body;

  try {
    const query = {
      text: "SELECT * FROM users WHERE  email = $1",
      values: [user_email],
    };
    const result = await pool.query(query);

    const { user_id, email, full_name, role, hashed_password } = result.rows[0];

    if (!comparePassword(password, hashed_password)) {
      return res.json("error pw");
    }

    const access_token = jwt.sign({ id: user_id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refresh_token = jwt.sign(
      { id: user_id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME!, refresh_token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE),
    });

    res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME!, access_token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE),
    });

    return res.json({ access_token }).status(200);
  } catch (error) {
    throw error;
  }
};

export default loginController;
```

- LogoutController.ts.

```typescript
// controller/logoutController.ts

import { Request, Response } from "express";

const logoutController = async (_req: Request, res: Response) => {
  res
    .clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME!)
    .clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME!)
    .status(200)
    .end();
};

export default logoutController;
```

- Me Controller.ts.

```typescript
// controller/meController.ts

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../../../config/db";

const meController = async (req: Request, res: Response) => {
  const { SabirAuth } = req.cookies;

  if (!SabirAuth) return res.status(401).json({ message: "Unauthorized!" });

  const decoded: any = jwt.verify(SabirAuth, process.env.JWT_SECRET!);

  const query = {
    text: "SELECT * FROM users WHERE user_id = $1",
    values: [decoded.id],
  };

  const result = await pool.query(query);
  const { user_id, email, full_name, role, hashed_password } = result.rows[0];

  return res
    .json({ user_id, email, full_name, role, hashed_password })
    .status(200);
};
export default meController;
```

- Refresh controller.

```typescript
// controller/meController.ts

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const refreshController = (req: Request, res: Response) => {
  const { SabirAuthRefresh } = req.cookies;

  if (!SabirAuthRefresh) {
    return res.status(400).json({ message: "Refresh token is expired!" });
  }

  const decoded: any = jwt.verify(
    SabirAuthRefresh,
    process.env.JWT_REFRESH_SECRET!
  );

  const access_token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refresh_token = jwt.sign(
    { id: decoded.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME!, refresh_token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE),
  });

  res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME!, access_token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE),
  });

  return res.json({ access_token }).status(200);
};

export default refreshController;
```

- validation middleware.

```typescript
//  middleware/validate.ts

import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
```

- Encrypting password.

```typescript
// utils/hashPassword.ts

import bcrypt from "bcrypt";

const saltRounds = 10;
export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
```

- Zod login validation.

```typescript
// validation/login.ts

import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    user_email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});
```

- Zod signUp validation.

```typescript
// validation/signUp.ts

import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    fullName: z
      .string({
        required_error: "Full name is required",
      })
      .min(3, "Name must be at least 3 characters"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 chars")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol"
      ),
  }),
});
```

- Routes.

```typescript
// routes/index.ts

import express, { Response, Request } from "express";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../validation/login";
import { signupSchema } from "../validation/signUp";
import loginController from "../controllers/loginController";
import signUpController from "../controllers/signupController";
import meController from "../controllers/meController";
import logoutController from "../controllers/logoutController";
import refreshController from "../controllers/refreshController";

loginController;
const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signUpController);
authRouter.post("/login", validate(loginSchema), loginController);
authRouter.get("/me", meController);
authRouter.get("/logout", logoutController);
authRouter.get("/refresh", refreshController);

export { authRouter };
```

- Application server.

```typescript
// .server.ts

import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { authRouter } from "./features/auth/routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

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
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello Express Backend ! ");
});

app.listen(PORT, () => {
  console.log(
    `Server running at ${process.env.SCHEME}://${process.env.HOST}:${process.env.PORT}`
  );
});
```
