require("dotenv").config();
const Hapi = require("@hapi/hapi");
const HapiSwagger = require("hapi-swagger");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const Context = require("./db/strategies/base/interfaceStrategy");
const MongoDB = require("./db/strategies/mongodb/mongodb");
const heroesSchema = require("./db/strategies/mongodb/schemas/heroesSchema");
const HeroRoute = require("./routes/heroRoutes");
const AuthRoute = require("./routes/authRoutes");
const HapiJWT = require("hapi-auth-jwt2");
const Postgres = require("./db/strategies/postgres/postgres");
const userSchema = require("./db/strategies/postgres/schemas/userSchema");

const JWT_SECRET = process.env.JWT_KEY;

const app = new Hapi.Server({
  port: process.env.PORT
});

function mapRoutes(instace, methods) {
  return methods.map(method => instace[method]());
}

async function main() {
  const connectionMongo = await MongoDB.connect({
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  const Mongocontext = new Context(new MongoDB(connectionMongo, heroesSchema));
  const connectionPostgres = await Postgres.connect();
  const model = await Postgres.defineModel(connectionPostgres, userSchema);
  const Postgrescontext = new Context(new Postgres(connectionPostgres, model));

  const swaggerOptions = {
    info: {
      title: "API HEROES",
      version: "v1.0"
    }
  };
  await app.register([
    HapiJWT,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  app.auth.strategy("jwt", "jwt", {
    key: JWT_SECRET,
    validate: async (data, request) => {
      const [result] = await Postgrescontext.read({
        username: data.username.toLowerCase()
      });
      if (!result) {
        return {
          isValid: false
        };
      }

      return {
        isValid: true
      };
    }
  });

  app.auth.default("jwt");

  app.route([
    ...mapRoutes(new HeroRoute(Mongocontext), HeroRoute.methods()),
    ...mapRoutes(
      new AuthRoute(JWT_SECRET, Postgrescontext),
      AuthRoute.methods()
    )
  ]);

  await app.start();
  console.log(`Server is Running port ${app.info.port}`);

  return app;
}

module.exports = main();
