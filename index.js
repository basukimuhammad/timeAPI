const Fastify = require("fastify");
const cerpen = require("./api/timeApi.js"); // Import fungsi cerpen

const app = Fastify({
  logger: true,
  ajv: { customOptions: { strict: false } }, // Disable strict mode
});

// Swagger setup
app.register(require("@fastify/swagger"), {
  swagger: {
    info: {
      title: "API Cerpen",
      description: "API untuk mendapatkan cerpen dari kategori tertentu",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      {
        name: "Cerpen",
        description: "Operasi terkait cerpen",
      },
    ],
  },
});

app.register(require("@fastify/swagger-ui"), {
  routePrefix: "/docs",
  staticCSP: true,
  transformStaticCSP: (header) => header,
  uiConfig: {
    docExpansion: "full", // Menampilkan seluruh dokumentasi
    deepLinking: true,
  },
});

// Main endpoint
app.get("/", async (req, res) => {
  res.send("Selamat datang di API Cerpen! Buka dokumentasi di /docs.");
});

// Endpoint untuk mendapatkan cerpen berdasarkan kategori
app.get(
  "/cerpen/:category",
  {
    schema: {
      description: "Dapatkan cerpen berdasarkan kategori",
      tags: ["Cerpen"], // Harus sesuai dengan tag di Swagger config
      params: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Kategori cerpen yang ingin diambil",
            example: "cinta",
          },
        },
        required: ["category"],
      },
      response: {
        200: {
          description: "Cerpen berhasil diambil",
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: {
              type: "object",
              properties: {
                title: { type: "string", example: "Judul Cerpen" },
                author: { type: "string", example: "Nama Penulis" },
                kategori: { type: "string", example: "Cinta" },
                lolos: { type: "string", example: "2024-01-01" },
                cerita: { type: "string", example: "Isi cerpen ..." },
              },
            },
          },
        },
        400: {
          description: "Kesalahan input",
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string", example: "Kategori tidak ditemukan" },
          },
        },
      },
    },
  },
  async (req, res) => {
    try {
      const category = req.params.category;
      const hasilCerpen = await cerpen(category); // Memanggil fungsi cerpen
      res.send({
        status: "success",
        data: hasilCerpen,
      });
    } catch (err) {
      res.status(400).send({
        status: "error",
        message: err.message,
      });
    }
  }
);

// Generate Swagger spec
app.ready((err) => {
  if (err) throw err;
  console.log(app.printRoutes());
  app.swagger();
});

// Start the server
const port = process.env.PORT || 3000;
app.listen({ port }, () => {
  console.log(`Server running on port: ${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/docs`);
});
