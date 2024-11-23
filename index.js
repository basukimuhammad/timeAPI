const express = require('express');
const cerpen = require('./api/timeApi'); // Mengimpor fungsi cerpen

const app = express();
const PORT = process.env.PORT || 3000;

// Rute Utama
app.get('/', (req, res) => {
    res.send('Selamat datang di API Cerpen Fax!');
});

// Rute Cerpen Berdasarkan Kategori
app.get('/cerpen/:category', async (req, res) => {
    const category = req.params.category;

    try {
        const hasilCerpen = await cerpen(category);
        res.json({
            status: 'success',
            data: hasilCerpen
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil cerpen. Pastikan kategori benar atau coba lagi nanti.',
            error: error.message
        });
    }
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});￼Enter
