const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "rtiktok",
  alias: ["rtt", "tiktokdl"],
  desc: "🎵 Download TikTok Video (Auto-Fallback Prince API)",
  category: "downloader",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("⚠️ Please provide a valid TikTok link!");

    await reply("⏳ *Fetching TikTok video... Please wait!*");

    // 🔹 Prince API list (auto fallback)
    const apis = [
      `https://api.princetechn.com/api/download/tiktok?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(q)}`,
      `https://api.princetechn.com/api/download/tiktokdlv2?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(q)}`,
      `https://api.princetechn.com/api/download/tiktokdlv3?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(q)}`,
      `https://api.princetechn.com/api/download/tiktokdlv4?apikey=prince_tech_api_azfsbshfb&url=${encodeURIComponent(q)}`
    ];

    let videoUrl = null, data = null, successApi = null;

    // Try all APIs until one works
    for (const api of apis) {
      try {
        const res = await axios.get(api);
        const raw = res.data;

        data =
          raw.data?.video ||
          raw.data?.result ||
          raw.data ||
          raw.result ||
          raw;

        videoUrl =
          data?.nowatermark ||
          data?.no_watermark ||
          data?.url ||
          data?.play ||
          data?.play_url ||
          data?.video?.url ||
          data?.video?.no_watermark ||
          data?.data?.play ||
          data?.data?.url ||
          null;

        if (videoUrl) {
          successApi = api;
          break;
        }
      } catch (e) {
        console.log("❌ API failed:", api);
      }
    }

    if (!videoUrl) {
      return reply("❌ All APIs failed! No valid download link found.");
    }

    // 🧩 Downloading video
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const filePath = path.join(tempDir, `tiktok_${Date.now()}.mp4`);
    const videoBuffer = await axios.get(videoUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, videoBuffer.data);

    // 🎨 Stylish caption
    const caption = `
╭═════════════════════╮
   💫 𝑻𝒊𝒌𝑻𝒐𝒌 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒓 💫
╰═════════════════════╯

🎬 *Title:* ${data.title || "Unknown"}
👤 *Author:* ${data.author || "Unknown"}
📡 *API Used:* ${successApi.includes("v4") ? "Version 4" : successApi.includes("v3") ? "Version 3" : successApi.includes("v2") ? "Version 2" : "Main"}
🌍 *Source:* TikTok

⚡ *Powered by 𝑹𝒂𝒉𝒎𝒂𝒏-𝒎𝒅* ⚡
`;

    // 🎥 Send video
    await conn.sendMessage(from, {
      video: fs.readFileSync(filePath),
      caption,
      mimetype: "video/mp4",
    }, { quoted: mek });

    fs.unlinkSync(filePath);
    await conn.sendMessage(from, { text: "✅ *Video sent successfully!*" }, { quoted: mek });

  } catch (err) {
    console.error("TikTok Downloader Error:", err);
    reply("❌ Something went wrong while downloading the TikTok video!");
  }
});
