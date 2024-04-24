# First step : Express + typescript setup.

- Create your project repository on github.
- clone your repo and cd to it.
- Run `npm init -y`.

- generate tsconfig.json `npx tsc --init` and uncomment `"outDir": "./build"` ,`"rootDir": "./src"`.

### Install Dependencies.

```plaintext
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

### Docker PostgreSQL Container Setup.

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

### Link Database with express App.

- Install pg and dotenv.

```
npm install pg dotenv
```

- Install pg types

```
npm i -D @types/pg
```

- Add db.ts to rootDir.

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

<!-- - Lets create a route to test our database.

```
├── src
│   ├── controller
│   │   ├── signUpController.ts
│   ├── routes
│   │   ├──authRoute.ts

``` -->
