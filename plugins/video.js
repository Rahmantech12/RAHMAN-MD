const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "video",
  alias: ["ytxx", "youtube"],
  desc: "Download YouTube videos using Jawad-Tech API",
  category: "downloader",
  react: "🎥",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("⚠️ Please provide a valid YouTube link!\n\nExample: *.yt https://youtu.be/xyz123*");

    const statusMsg = await reply("⏳ Fetching your video, please wait...");

    // Call API
    const apiUrl = `https://jawad-tech.vercel.app/download/yt?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.download_url) {
      return reply("❌ Failed to get download link. Maybe invalid or unsupported URL.");
    }

    const videoUrl = data.download_url;
    const title = data.title || "YouTube Video";

    // Download video temporarily
    const filePath = path.join(__dirname, `${Date.now()}.mp4`);
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    writer.on('finish', async () => {
      try {
        await conn.sendMessage(from, { 
          video: fs.readFileSync(filePath), 
          caption: `
╭════════════════════╮
🎬 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑  
╰════════════════════╯
🎥 *𝐓𝐈𝐓𝐋𝐄:* ${title}

   𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑹𝒂𝒉𝒎𝒂𝒏-𝒎𝒅
`, 
          mimetype: 'video/mp4' 
        });
        fs.unlinkSync(filePath);
        await conn.sendMessage(from, { delete: statusMsg.key });
      } catch (err) {
        console.error(err);
        reply("❌ Error sending video. File may be too large.");
      }
    });

    writer.on('error', (err) => {
      console.error(err);
      reply("❌ Error downloading video.");
    });

  } catch (err) {
    console.error(err);
    reply("❌ Something went wrong! Please try again later.");
  }
});
