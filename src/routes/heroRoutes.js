const BaseRoutes = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("@hapi/boom");

const failAction = (request, headers, error) => {
  throw error;
};

const headers = Joi.object({
  authorization: Joi.string().required()
}).unknown();

class HeroRoutes extends BaseRoutes {
  constructor(db) {
    super();
    this.db = db;
  }

  home() {
    return {
      method: "GET",
      path: "/",
      config: {
        auth: false,
        handler: (r, reply) => reply.redirect("/documentation")
      }
    };
  }

  list() {
    return {
      path: "/heroes",
      method: "GET",
      config: {
        tags: ["api"],
        description: "List Heroes",
        notes: "Lists heroes by filtering by name and pagination results",
        validate: {
          failAction,
          headers,
          query: {
            skip: Joi.number()
              .integer()
              .default(0),
            limit: Joi.number()
              .integer()
              .default(10),
            name: Joi.string()
              .min(3)
              .max(100)
          }
        }
      },
      handler: (request, headers) => {
        try {
          const { name, skip, limit } = request.query;

          const query = name
            ? { name: { $regex: `.*${name}*.`, $options: "i" } }
            : {};

          return this.db.read(query, skip, limit);
        } catch (error) {
          console.log("Error", error);
          return Boom.internal();
        }
      }
    };
  }

  create() {
    return {
      path: "/heroes",
      method: "POST",
      config: {
        tags: ["api"],
        description: "Create Hero",
        notes: "Create hero by name and power",
        validate: {
          failAction,
          headers,
          payload: {
            name: Joi.string()
              .required()
              .min(3)
              .max(100),
            power: Joi.string()
              .required()
              .min(3)
              .max(100)
          }
        }
      },
      handler: async request => {
        try {
          const { name, power } = request.payload;
          const result = await this.db.create({ name, power });

          return {
            message: "successfully created hero",
            id: result._id
          };
        } catch (error) {
          console.log("Error", erro);
          return Boom.internal();
        }
      }
    };
  }

  update() {
    return {
      path: "/heroes/{id}",
      method: "PATCH",
      config: {
        tags: ["api"],
        description: "Update Hero by id",
        notes: "Update hero name and power",
        validate: {
          failAction,
          headers,
          params: {
            id: Joi.string().required()
          },
          payload: {
            name: Joi.string()
              .min(3)
              .max(100),
            power: Joi.string()
              .min(3)
              .max(100)
          }
        }
      },
      handler: async request => {
        try {
          const { id } = request.params;
          const { payload } = request;

          const dadosString = JSON.stringify(payload);
          const dados = JSON.parse(dadosString);

          const result = await this.db.update(id, dados);

          if (result.nModified !== 1)
            return Boom.preconditionFailed("id not found");

          return {
            message: "successfully updated hero"
          };
        } catch (error) {
          console.log("Error", error);
          return Boom.internal();
        }
      }
    };
  }

  delete() {
    return {
      path: "/heroes/{id}",
      method: "DELETE",
      config: {
        tags: ["api"],
        description: "Delete Hero",
        notes: "Delete hero by id",
        validate: {
          failAction,
          headers,
          params: {
            id: Joi.string().required()
          }
        }
      },
      handler: async request => {
        try {
          const { id } = request.params;

          const result = await this.db.delete(id);

          if (result.n !== 1) return Boom.preconditionFailed("id not found");

          return {
            message: "Successfully deleted hero"
          };
        } catch (error) {
          console.log("Error", error);
          return Boom.internal();
        }
      }
    };
  }
}

module.exports = HeroRoutes;
