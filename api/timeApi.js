const axios = require("axios");
const cheerio = require("cheerio");

async function cerpen(category) {
    return new Promise((resolve, reject) => {
        let title = category.toLowerCase().replace(/[()*]/g, ""); // Hapus karakter khusus
        let judul = title.replace(/\s/g, "-"); // Ganti spasi dengan "-"
        let page = Math.floor(Math.random() * 5) + 1; // Pilih halaman acak (1-5)

        console.log(`Fetching category: cerpen-${judul}, page: ${page}`); // Debugging log

        // Akses halaman kategori
        axios
            .get(`http://cerpenmu.com/category/cerpen-${judul}/page/${page}`)
            .then((response) => {
                const $ = cheerio.load(response.data);
                const links = [];

                // Ambil semua link artikel cerpen
                $("article.post").each((i, el) => {
                    const link = $(el).find("a").attr("href");
                    if (link) links.push(link);
                });

                console.log(`Found ${links.length} links in category: cerpen-${judul}`); // Debugging log

                if (links.length === 0) {
                    return reject(new Error("Tidak ada cerpen ditemukan untuk kategori ini."));
                }

                // Pilih salah satu link secara acak
                const randomLink = links[Math.floor(Math.random() * links.length)];

                // Ambil konten dari link cerpen
                axios
                    .get(randomLink)
                    .then((res) => {
                        const $$ = cheerio.load(res.data);

                        // Parsing data cerpen
                        const hasil = {
                            title: $$("#content > article > h1").text().trim() || "Tidak ada judul",
                            author: $$("#content > article")
                                .text()
                                .split("Cerpen Karangan: ")[1]
                                ?.split("Kategori: ")[0]
                                .trim() || "Tidak ada penulis",
                            kategori: $$("#content > article")
                                .text()
                                .split("Kategori: ")[1]
                                ?.split("\n")[0]
                                .trim() || "Tidak ada kategori",
                            lolos: $$("#content > article")
                                .text()
                                .split("Lolos moderasi pada: ")[1]
                                ?.split("\n")[0]
                                .trim() || "Tidak ada tanggal moderasi",
                            cerita: $$("#content > article > p")
                                .map((i, el) => $$(el).text().trim())
                                .get()
                                .join("\n") || "Tidak ada cerita",
                        };

                        console.log(`Fetched story: ${hasil.title}`); // Debugging log
                        resolve(hasil);
                    })
                    .catch((err) => {
                        console.error(`Failed to fetch story from: ${randomLink}`);
                        reject(err);
                    });
            })
            .catch((err) => {
                console.error(`Failed to fetch category page: cerpen-${judul}, page: ${page}`);
                reject(err);
            });
    });
}

module.exports = cerpen;
