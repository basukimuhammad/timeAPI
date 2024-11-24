const path = require("path");
const Fastify = require("fastify");
const cerpen = require("./api/timeApi.js"); // Import fungsi cerpen

// ** Inisialisasi Fastify **
const app = Fastify({
  logger: true,
  ajv: {
    customOptions: { strict: false }, // Nonaktifkan strict mode
  },
});

// ** Swagger Plugin **
app.register(require("@fastify/swagger"), {
  swagger: {
    info: {
      title: "API Cerpen Fax",
      description: "API untuk mendapatkan cerpen dari kategori tertentu",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

app.register(require("@fastify/swagger-ui"), {
  routePrefix: "/docs",
  staticCSP: true,
});

// ** Endpoint Utama **
app.get("/", async (req, res) => {
  res.send("Selamat datang di API Cerpen Fax! Buka dokumentasi di /docs.");
});

// ** Endpoint untuk Mendapatkan Cerpen **
app.get(
  "/cerpen/:category",
  {
    schema: {
      description: "Dapatkan cerpen berdasarkan kategori",
      tags: ["Cerpen"],
      params: {
        type: "object",
        properties: {
          category: { type: "string", description: "Kategori cerpen", example: "cinta" },
        },
        required: ["category"],
      },
      response: {
        200: {
          description: "Cerpen berhasil diambil",
          type: "object",
          properties: {
            status: { type: "string" },
            data: {
              type: "object",
              properties: {
                title: { type: "string" },
                author: { type: "string" },
                kategori: { type: "string" },
                lolos: { type: "string" },
                cerita: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  async (req, res) => {
    const category = req.params.category;
    const hasilCerpen = await cerpen(category);
    res.send({
      status: "success",
      data: hasilCerpen,
    });
  }
);

// ** Swagger - Generate Spesifikasi Swagger **
app.ready((err) => {
  if (err) throw err;
  console.log(app.printRoutes()); // Debugging
  app.swagger();
});

// ** Menentukan Port Server **
const port = process.env.PORT || 3000;
app.listen({ port }, () => {
  console.log(`Server running on port: ${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/docs`);
});
