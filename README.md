## What is it?

- It's build on top of [scalable-node](https://github.com/OnurYurteri/scalable-node) boilerplate.
- What's more
  - Sign & Login with google.
  - Store users google token on mongo, return your own jwt token!
  - Authenticate with jwt!
  - Profit!
  - And oh, it retrieves users upcoming events for demo purposes.

### Made Out Of

- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com)
- [Helmet](https://helmetjs.github.io/)
- [Mongoose](http://mongoosejs.com/docs/guide.html)
- [Nodemon](https://nodemon.io/)
- [Morgan](https://github.com/expressjs/morgan)
- [Winston](https://github.com/winstonjs/winston)
- [Jest](https://github.com/facebook/jest)
- [SuperTest](https://github.com/visionmedia/supertest)
- [ESLint](https://eslint.org/)
- [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
- [prettier-eslint](https://github.com/prettier/prettier-eslint)
- [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [dotenv](https://github.com/motdotla/dotenv)
- [google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client)

### Installing

- Copy contents of your _credentials.json_ which you retreived from [Google Developers Console](https://console.developers.google.com/) to _src/app/credentials/google.json_

```bash
git clone https://github.com/OnurYurteri/node-google-auth-jwt.git
cd node-google-auth-jwt/src
npm ci
```

### Scripts

| Script                | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| npm run dev           | Starts development server at localhost:3000                             |
| npm run debug         | Starts debugging with [Inspector](https://nodejs.org/en/docs/inspector) |
| npm run lint          | Run Eslint to find out linting issues.                                  |
| npm run test          | Run Jest to run tests.                                                  |
| npm run test:watch    | Run Jest to run tests on watch mode.                                    |
| npm run test:debug    | Run Jest tests with [Inspector](https://nodejs.org/en/docs/inspector)   |
| npm run test:coverage | Run [Istanbul](https://istanbul.js.org) for test coverage report        |

### Run at local server

```bash
cd node-google-auth-jwt/src
cp .env.example .env

npm run start
http://localhost:3000/
```

### Run with Docker

```bash
cd node-google-auth-jwt
docker build -t node-google-auth-jwt_src:1.0 .
docker run --publish 3000:3000 node-google-auth-jwt_src:1.0

http://localhost:3000/
```

### With docker-compose (Multiple instance, nginx, mongoDB)

```bash
cd node-google-auth-jwt
docker build -t node-google-auth-jwt_src:1.0 .
docker-compose up

http://localhost/
http://localhost:8080/
```
