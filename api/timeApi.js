const axios = require("axios");
const cheerio = require("cheerio");

async function cerpen(category) {
  return new Promise((resolve, reject) => {
    let title = category.toLowerCase().replace(/[()*]/g, ""); // Bersihkan kategori
    let judul = title.replace(/\s/g, "-"); // Ganti spasi dengan "-"
    let page = Math.floor(Math.random() * 5) + 1; // Pilih halaman secara acak (1-5)

    console.log(`Fetching category: cerpen-${judul}, page: ${page}`); // Log kategori & halaman

    // Ambil halaman kategori
    axios
      .get(`http://cerpenmu.com/category/cerpen-${judul}/page/${page}`)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const links = [];

        // Ambil semua link cerpen
        $("article.post").each((i, el) => {
          const link = $(el).find("a").attr("href");
          if (link) links.push(link);
        });

        console.log(`Found ${links.length} links`); // Log jumlah link ditemukan

        if (links.length === 0) {
          return reject(new Error("Tidak ada cerpen ditemukan untuk kategori ini."));
        }

        // Pilih link acak dari daftar
        const randomLink = links[Math.floor(Math.random() * links.length)];

        console.log(`Fetching story from: ${randomLink}`); // Log link cerpen yang diambil

        // Ambil konten cerpen
        axios
          .get(randomLink)
          .then((res) => {
            const $$ = cheerio.load(res.data);

            // Parsing data cerpen
            const title = $$("#content > article > h1").text().trim() || "Tidak ada judul";
            const author = $$("#content > article")
              .text()
              .split("Cerpen Karangan: ")[1]
              ?.split("Kategori: ")[0]
              .trim() || "Tidak ada penulis";
            const kategori = $$("#content > article")
              .text()
              .split("Kategori: ")[1]
              ?.split("\n")[0]
              .trim() || "Tidak ada kategori";
            const lolos = $$("#content > article")
              .text()
              .split("Lolos moderasi pada: ")[1]
              ?.split("\n")[0]
              .trim() || "Tidak ada informasi moderasi";
            const cerita = $$("#content > article > p")
              .map((i, el) => $$(el).text().trim())
              .get()
              .join("\n") || "Tidak ada cerita";

            // Gabungkan data ke format JSON
            const hasil = {
              title,
              author,
              kategori,
              lolos,
              cerita,
            };

            console.log(`Story fetched: ${title}`); // Log judul cerita
            resolve(hasil);
          })
          .catch((err) => {
            console.error(`Error fetching story: ${err.message}`); // Log error cerita
            reject(err);
          });
      })
      .catch((err) => {
        console.error(`Error fetching category page: ${err.message}`); // Log error kategori
        reject(err);
      });
  });
}

module.exports = cerpen;
