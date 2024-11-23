const fs = require('fs');
const path = require("path");
const Fastify = require('fastify');
const cerpen = require('./api/timeApi.js'); // Impor fungsi cerpen dari timeApi.js

const app = Fastify({
  logger: true
});

// Konfigurasi untuk file statis
app.register(require('@fastify/static'), {
  root: path.join(__dirname, 'api'),
});

// Endpoint utama
app.get('/', async (req, res) => {
  res.send({ message: 'Selamat datang di API Cerpen Fax!' });
});

// Endpoint untuk mendapatkan cerpen berdasarkan kategori
app.get('/cerpen/:category', async (req, res) => {
  const category = req.params.category;

  try {
    const hasilCerpen = await cerpen(category); // Panggil fungsi cerpen
    res.send({
      status: 'success',
      data: hasilCerpen
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Gagal mengambil cerpen. Pastikan kategori benar atau coba lagi nanti.',
      error: error.message
    });
  }
});

// Menentukan port server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port : ${port}`);
});
