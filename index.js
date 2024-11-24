const path = require("path");
const Fastify = require("fastify");
const cerpen = require("./api/timeApi.js"); // Import fungsi cerpen

const app = Fastify({
  logger: true,
});

// Konfigurasi file statis
app.register(require("@fastify/static"), {
  root: path.join(__dirname, "api"),
});

// Endpoint utama
app.get("/", async (req, res) => {
  res.send("Selamat datang di API Cerpen By Basuki! Gunakan endpoint /cerpen/category untuk mendapatkan cerpen.");
});

// Endpoint untuk mendapatkan cerpen
app.get("/cerpen/:category", async (req, res) => {
  const category = req.params.category;

  try {
    const hasilCerpen = await cerpen(category); // Panggil fungsi cerpen
    res.send({
      status: "success",
      data: hasilCerpen,
    }); // Kirim hasil dalam format JSON
  } catch (error) {
    console.error(`Error in API /cerpen/: ${error.message}`); // Log error API
    res.status(500).send({
      status: "error",
      message: "Gagal mengambil cerpen. Pastikan kategori benar atau coba lagi nanti.",
      error: error.message,
    });
  }
});

// Menentukan port server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
