const axios = require("axios");
const cheerio = require("cheerio");

async function cerpen(category) {
  return new Promise((resolve, reject) => {
    let title = category.toLowerCase().replace(/[()*]/g, "");
    let judul = title.replace(/\s/g, "-");
    let page = Math.floor(Math.random() * 5) + 1; // Pilih halaman secara acak (1-5)

    console.log(`Fetching category: ${judul}, page: ${page}`); // Debug log

    axios
      .get(`http://cerpenmu.com/category/cerpen-${judul}/page/${page}`)
      .then((get) => {
        let $ = cheerio.load(get.data);
        let links = [];

        // Ambil semua link cerpen pada halaman tersebut
        $("article.post").each(function (index, element) {
          links.push($(element).find("a").attr("href"));
        });

        console.log(`Found links: ${links.length}`); // Debug log

        if (links.length === 0) {
          return reject(new Error("Tidak ada cerpen ditemukan untuk kategori ini."));
        }

        // Pilih salah satu link secara acak
        let random = links[Math.floor(Math.random() * links.length)];

        // Fetch cerpen dari link tersebut
        axios
          .get(random)
          .then((res) => {
            let $$ = cheerio.load(res.data);
            let hasil = {
              title: $$("#content > article > h1").text(),
              author: $$("#content > article")
                .text()
                .split("Cerpen Karangan: ")[1]
                .split("Kategori: ")[0]
                .trim(),
              kategori: $$("#content > article")
                .text()
                .split("Kategori: ")[1]
                .split("\n")[0]
                .trim(),
              lolos: $$("#content > article")
                .text()
                .split("Lolos moderasi pada: ")[1]
                .split("\n")[0]
                .trim(),
              cerita: $$("#content > article > p").text().trim(),
            };

            console.log(`Fetched story: ${hasil.title}`); // Debug log
            resolve(hasil);
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

module.exports = cerpen;
