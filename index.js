const Fastify = require('fastify');
const cerpen = require('./api/timeApi.js'); // Impor fungsi cerpen dari timeApi.js

const app = Fastify({
  logger: true
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
module.exports = app;
