const path = require("path");
const Fastify = require("fastify");
const cerpen = require("./api/timeApi.js"); // Import fungsi cerpen

// ** Inisialisasi Fastify **
const app = Fastify({
  logger: true,
  ajv: {
    customOptions: { strict: false }, // Nonaktifkan mode strict untuk support 'example'
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
  routePrefix: "/docs", // Akses Swagger UI di http://localhost:3000/docs
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// ** Konfigurasi File Statis **
app.register(require("@fastify/static"), {
  root: path.join(__dirname, "api"),
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
      tags: ["Cerpen"], // Grup di Swagger UI
      params: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Kategori cerpen yang ingin dicari",
            example: "cinta", // Contoh input kategori
          },
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
        500: {
          description: "Gagal mengambil cerpen",
          type: "object",
          properties: {
            status: { type: "string" },
            message: { type: "string" },
            error: { type: "string" },
          },
        },
      },
    },
  },
  async (req, res) => {
    const category = req.params.category;

    try {
      const hasilCerpen = await cerpen(category); // Panggil fungsi cerpen
      res.send({
        status: "success",
        data: hasilCerpen,
      });
    } catch (error) {
      console.error(`Error in API /cerpen/: ${error.message}`); // Log error API
      res.status(500).send({
        status: "error",
        message: "Gagal mengambil cerpen. Pastikan kategori benar atau coba lagi nanti.",
        error: error.message,
      });
    }
  }
);

// ** Swagger - Generate Spesifikasi Swagger **
app.ready((err) => {
  if (err) throw err;
  app.swagger(); // Generate spesifikasi Swagger
});

// ** Menentukan Port Server **
const port = process.env.PORT || 3000;
app.listen({ port }, () => {
  console.log(`Server running on port: ${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/docs`);
});
