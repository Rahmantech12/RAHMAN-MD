const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  react: '📥',
  desc: "Download videos from Facebook (API v4)",
  category: "download",
  use: ".fb <Facebook video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const fbUrl = args[0];
    if (!fbUrl || !fbUrl.includes("facebook.com")) {
      return reply('❌ Please provide a valid Facebook video URL.\n\nExample:\n.fb https://facebook.com/...');
    }

    // React loading
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://jawad-tech.vercel.app/downloader?url=${encodeURIComponent(fbUrl)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || data.status !== true || !data.result) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply('❌ Failed to fetch video. Please try again later.');
    }

    // HD/SD Quality Check
    let videoUrl = null;
    let quality = null;

    if (Array.isArray(data.result)) {
      const hd = data.result.find(v => v.quality?.toLowerCase() === "hd");
      const sd = data.result.find(v => v.quality?.toLowerCase() === "sd");
      const selected = hd || sd;
      if (selected) {
        videoUrl = selected.url;
        quality = selected.quality;
      }
    } else if (data.result.url) {
      videoUrl = data.result.url;
      quality = data.result.quality || "Unknown";
    }

    if (!videoUrl) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ Couldn't find a downloadable video link.");
    }

    await reply(`📤 *Rahman-MD uploading your Facebook video...*`);

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `‎*📥 ʀᴀʜᴍᴀɴ-ᴍᴅ ғᴀᴄᴇʙᴏᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*\n
*📺 Quality:* ${quality}\n
*⚙️ Powered by Rahman-MD Bot*`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('FB Downloader Error:', error);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply('⚠️ An error occurred while processing your request. Try again later.');
  }
});
