const BaseRoutes = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("@hapi/boom");
const JWT = require("jsonwebtoken");
const PasswordHelper = require("../helpers/passwordHelper");

const failAction = (request, headers, error) => {
  throw error;
};

class AuthRoutes extends BaseRoutes {
  constructor(secret, db) {
    super();
    this.secret = secret;
    this.db = db;
  }
  login() {
    return {
      path: "/login",
      method: "POST",
      config: {
        auth: false,
        tags: ["api"],
        description: "Get Token",
        notes: "Login with username and password",
        validate: {
          failAction,
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
          }
        }
      },
      handler: async request => {
        const { username, password } = request.payload;

        const [user] = await this.db.read({
          username: username.toLowerCase()
        });

        if (!user) {
          return Boom.unauthorized("User doesn't exists");
        }

        const match = PasswordHelper.comparePassword(password, user.password);

        if (!match) {
          return Boom.unauthorized("Incorrect username or password");
        }

        const token = JWT.sign(
          {
            username: username,
            id: user.id
          },
          this.secret
        );

        return {
          token
        };
      }
    };
  }

  create() {
    return {
      path: "/create",
      method: "POST",
      config: {
        auth: false,
        tags: ["api"],
        description: "Create User",
        notes: "Create User with username and password",
        validate: {
          failAction,
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
          }
        }
      },
      handler: async request => {
        const { username, password } = request.payload;

        const [user] = await this.db.read({
          username: username.toLowerCase()
        });

        if (user) {
          return Boom.unauthorized("existing username in database");
        }

        const hash = await PasswordHelper.hashPassword(password);

        const result = await this.db.create({
          username: username,
          password: hash
        });

        return {
          message: "successfully created user",
          id: result._id
        };
      }
    };
  }
}

module.exports = AuthRoutes;
