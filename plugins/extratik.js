const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadTikTok(conn, from, m, q, reply, version, apiUrl, captionStyle) {
  try {
    if (!q) return reply("⚠️ Please provide a valid TikTok video link!");

    // Step 1: Send initial message
    const statusMsg = await reply("⬇️ *Downloading video...*");

    // Fetch video data
    const res = await axios.get(`${apiUrl}${encodeURIComponent(q)}`);
    const data = res.data.data || res.data.video || res.data.result || res.data;

    if (!data) return reply(`❌ Failed to fetch data from API ${version}.`);

    const videoUrl =
      data.nowatermark ||
      data.no_watermark ||
      data.play ||
      data.play_url ||
      data.url ||
      data.video;

    if (!videoUrl) return reply("❌ No valid download link found!");

    // Step 2: Update message to “Processing...”
    try {
      await conn.sendMessage(from, { text: "⚙️ *Processing video...*", edit: statusMsg.key });
    } catch {
      await reply("⚙️ *Processing video...*");
    }

    // Create temp folder if not exists
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // Download video to temp
    const filePath = path.join(tempDir, `tiktok_${version}_${Date.now()}.mp4`);
    const video = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, video.data);

    // Step 3: Update message to “Done ✅”
    try {
      await conn.sendMessage(from, { text: "✅ *Download complete!* Sending video...", edit: statusMsg.key });
    } catch {
      await reply("✅ *Download complete!* Sending video...");
    }

    // 🎨 Stylish Captions
    let caption;
    switch (captionStyle) {
      case 1:
        caption = `
╭═══════🎵═══════╮
     ✨ 𝑻𝒊𝒌𝑻𝒐𝒌 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒓 ✨
╰═══════🎵═══════╯

🎬 *Title:* ${data.title || "No Title"}
👑 *Creator:* ${data.author || "Unknown"}
📦 *API:* Version 4
🌐 *Source:* TikTok

⚡ 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑹𝒂𝒉𝒎𝒂𝒏-𝒎𝒅 ⚡`;
        break;

      case 2:
        caption = `
╭━━━💎━━━━━━━💎━━━╮
      💫 𝑻𝒊𝒌𝑻𝒐𝒌 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒓 💫
╰━━━💎━━━━━━━💎━━━╯

🎧 *Title:* ${data.title || "Untitled"}
🎀 *Artist:* ${data.author || "Unknown"}
⚙️ *API:* Version 3
📲 *Platform:* TikTok

⚡ 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑹𝒂𝒉𝒎𝒂𝒏-𝒎𝒅 ⚡`;
        break;

      case 3:
        caption = `
╭────────🔥─────────╮
   🔥 𝑻𝒊𝒌𝑻𝒐𝒌  𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒓 🔥
╰───────🔥──────────╯

🎥 *Title:* ${data.title || "Unknown"}
🧑‍💻 *Uploader:* ${data.author || "Unknown"}
🧩 *API:* Version 2
📡 *Source:* TikTok

⚡ 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑹𝒂𝒉𝒎𝒂𝒏-𝒎𝒅 ⚡`;
        break;

      case 4:
        caption = `
╭━━━━━━━━━━━━━━━╮
🚀  𝑻𝒊𝒌𝑻𝒐𝒌 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒓   🚀
╰━━━━━━━━━━━━━━━╯

🎵 *Track:* ${data.title || "Untitled"}
🎤 *Author:* ${data.author || "Unknown"}
🛠️ *API:* Main
🌍 *Platform:* TikTok

⚡ 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑹𝒂𝒉𝒎𝒂𝒏-𝒎𝒅 ⚡`;
        break;

      default:
        caption = "🎵 TikTok Downloader\n⚡ Powered by Rahman-md ⚡";
        break;
    }

    // Send final video
    await conn.sendMessage(from, {
      video: fs.readFileSync(filePath),
      caption,
    }, { quoted: m });

    // Safe cleanup
    fs.unlink(filePath, () => {});
  } catch (err) {
    console.error(err);
    reply(`❌ Error downloading TikTok video (API ${version}).`);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Commands
cmd({
  pattern: "rtiktok1",
  alias: ["rtt1"],
  desc: "🎵 Download TikTok Video (API v4)",
  category: "downloader",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  await downloadTikTok(conn, from, m, q, reply, "v4",
    "https://api.princetechn.com/api/download/tiktokdlv4?apikey=prince_tech_api_azfsbshfb&url=",
    1);
});

cmd({
  pattern: "rtiktok2",
  alias: ["rtt2"],
  desc: "🎵 Download TikTok Video (API v3)",
  category: "downloader",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  await downloadTikTok(conn, from, m, q, reply, "v3",
    "https://api.princetechn.com/api/download/tiktokdlv3?apikey=prince_tech_api_azfsbshfb&url=",
    2);
});

cmd({
  pattern: "rtiktok3",
  alias: ["rtt3"],
  desc: "🎵 Download TikTok Video (API v2)",
  category: "downloader",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  await downloadTikTok(conn, from, m, q, reply, "v2",
    "https://api.princetechn.com/api/download/tiktokdlv2?apikey=prince_tech_api_azfsbshfb&url=",
    3);
});

cmd({
  pattern: "rtiktok4",
  alias: ["rtt4"],
  desc: "🎵 Download TikTok Video (Main API)",
  category: "downloader",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  await downloadTikTok(conn, from, m, q, reply, "main",
    "https://api.princetechn.com/api/download/tiktok?apikey=prince_tech_api_azfsbshfb&url=",
    4);
});