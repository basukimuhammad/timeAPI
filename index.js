const path = require("path");
const Fastify = require("fastify");
const cerpen = require("./api/timeApi.js"); // Import fungsi cerpen

// ** Inisialisasi Fastify **
const app = Fastify({
  logger: true,
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

// ** Endpoint Utama **
app.get("/", async (req, res) => {
  res.send("Selamat datang di API Cerpen Fax! Buka dokumentasi di /docs.");
});

// ** Endpoint untuk Mendapatkan Cerpen dengan Parameter Input**
app.get(
  "/cerpen/:category",
  {
    schema: {
      description: "Dapatkan cerpen berdasarkan kategori tertentu.",
      tags: ["Cerpen"], // Ini akan muncul di Swagger UI
      params: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Kategori cerpen yang ingin Anda ambil.",
            example: "fantasi", // Contoh nilai input
          },
        },
        required: ["category"], // Wajib diisi
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
                title: { type: "string", example: "Cerpen Fantasi" },
                author: { type: "string", example: "John Doe" },
                kategori: { type: "string", example: "Fantasi" },
                lolos: { type: "string", example: "Ya" },
                cerita: { type: "string", example: "Ini adalah cerita fantastis..." },
              },
            },
          },
        },
        500: {
          description: "Terjadi kesalahan pada server",
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string", example: "Gagal mengambil cerpen." },
            error: { type: "string", example: "Internal Server Error" },
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
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/docs`);
});
