const Fastify = require("fastify");
const app = Fastify({ logger: true });

// Swagger setup
app.register(require("@fastify/swagger"), {
  swagger: {
    info: {
      title: "Library API",
      description: "A simple Express Library API",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: "Posts", description: "posts of users" },
    ],
  },
});

app.register(require("@fastify/swagger-ui"), {
  routePrefix: "/docs",
  staticCSP: true,
  transformStaticCSP: (header) => header,
  uiConfig: {
    docExpansion: "full",
    deepLinking: true,
  },
});

// Data Dummy
const posts = [
  { id: 1, userId: 1, title: "my title", body: "my article" },
];

// GET all posts
app.get("/posts", {
  schema: {
    description: "Returns all posts",
    tags: ["Posts"],
    response: {
      200: {
        description: "List of posts",
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            title: { type: "string" },
            body: { type: "string" },
          },
        },
      },
    },
  },
}, async () => posts);

// GET post by ID
app.get("/posts/:id", {
  schema: {
    description: "gets posts by id",
    tags: ["Posts"],
    params: {
      type: "object",
      properties: {
        id: { type: "integer", description: "id of post" },
      },
      required: ["id"],
    },
    response: {
      200: {
        description: "post by its id",
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          title: { type: "string" },
          body: { type: "string" },
        },
      },
      400: {
        description: "post can not be found",
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
}, async (req, reply) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) {
    reply.status(400).send({ message: "Post not found" });
    return;
  }
  return post;
});

// POST a new post
app.post("/posts", {
  schema: {
    description: "Create a new post",
    tags: ["Posts"],
    body: {
      type: "object",
      properties: {
        userId: { type: "integer" },
        title: { type: "string" },
        body: { type: "string" },
      },
      required: ["userId", "title", "body"],
    },
    response: {
      201: {
        description: "Post created successfully",
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          title: { type: "string" },
          body: { type: "string" },
        },
      },
    },
  },
}, async (req) => {
  const newPost = { id: posts.length + 1, ...req.body };
  posts.push(newPost);
  return newPost;
});

// DELETE a post by ID
app.delete("/posts/:id", {
  schema: {
    description: "removes post from array",
    tags: ["Posts"],
    params: {
      type: "object",
      properties: {
        id: { type: "integer" },
      },
      required: ["id"],
    },
    response: {
      204: {
        description: "Post deleted successfully",
        type: "null",
      },
    },
  },
}, async (req, reply) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) {
    reply.status(400).send({ message: "Post not found" });
    return;
  }
  posts.splice(index, 1);
  reply.status(204).send();
});

// Start the server
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000/docs");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
