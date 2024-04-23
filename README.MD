 - Create your project repository on github.
 - clone your repo and cd to it.
 - run  ``` npm init -y ```

- generate tsconfig.json  ```npx tsc --init``` and uncomment     ``` "outDir": "./build" ``` ,``` "rootDir": "./src" ```. 

### Install Dependencies.

```plaintext
npm i express
```

### Install Dev Dependencies.

```plaintext
npm i -D @types/express rimraf nodemon typescript ts-node
```


### Setup the scripts.

```plaintext

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "rimraf ./build && tsc",
    "dev": "nodemon"
  },

```

### Create index.ts inside src folder.
- src
    - index.ts


### run your script 

- ``` npm run dev ```

 ```plaintext

 sabir@sabirlinux:~/Desktop/express-typescript-backend$ npm run dev

> express-typescript-backend@1.0.0 dev
> nodemon ./src/index.ts

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node ./src/index.ts`
server running on port 5000

 ```