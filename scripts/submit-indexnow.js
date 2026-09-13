const payload = {
  host: "switchrx.vercel.app",
  key: "f513dbbf346f48a88ae041219951d186",
  keyLocation: "https://switchrx.vercel.app/f513dbbf346f48a88ae041219951d186.txt",
  urlList: [
    "https://switchrx.vercel.app/",
    "https://switchrx.vercel.app/convert",
    "https://switchrx.vercel.app/convert/images",
    "https://switchrx.vercel.app/convert/video",
    "https://switchrx.vercel.app/convert/audio",
    "https://switchrx.vercel.app/convert/documents",
    "https://switchrx.vercel.app/convert/data",
    "https://switchrx.vercel.app/pdf-tools",
    "https://switchrx.vercel.app/compress",
    "https://switchrx.vercel.app/tools",
    "https://switchrx.vercel.app/tools/enhance",
    "https://switchrx.vercel.app/tools/archive",
    "https://switchrx.vercel.app/about",
  ],
};

async function submitIndexNow() {
  console.log("📡 Submitting all URLs to IndexNow (Bing, Yandex, Seznam, Naver)...");
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (res.status === 200 || res.status === 202) {
      console.log(`✅ Success (HTTP ${res.status} ${res.statusText}): All URLs accepted for instant indexing!`);
    } else {
      console.error(`⚠️ Response HTTP ${res.status}: ${res.statusText}`);
      const text = await res.text();
      if (text) console.error(text);
    }
  } catch (err) {
    console.error("❌ Failed to submit to IndexNow:", err);
  }
}

submitIndexNow();
