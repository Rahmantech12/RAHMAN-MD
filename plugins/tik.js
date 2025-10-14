const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "ratiktok",
  alias: ["ratt"],
  desc: "Download TikTok video",
  category: "downloader",
  react: "💠",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("⚙️ Example: .tiktok <url> | caption");

    const [url, caption] = q.split("|").map(v => v.trim());
    if (!/^https?:\/\//i.test(url)) return reply("❌ Invalid URL!");

    const api = `https://okatsu-rolezapiiz.vercel.app/downloader/tiktok?url=${encodeURIComponent(url)}`;
    reply("⚡ Fetching TikTok video...");

    const res = await axios.get(api);
    const data = res.data;

    const findUrl = (obj) => {
      if (!obj) return null;
      if (typeof obj === 'string' && obj.match(/\.mp4/i)) return obj;
      if (typeof obj === 'object') {
        for (const k in obj) {
          const found = findUrl(obj[k]);
          if (found) return found;
        }
      }
      return null;
    };

    const videoUrl = findUrl(data);
    if (!videoUrl) return reply("❌ No video link found!");

    const buffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });

    const stylishBox = `
╔═══⚡『 𝗥𝗔𝗛𝗠𝗔𝗡-𝗠𝗗 』⚡═══╗
┃ 💀 𝙋𝙊𝙒𝙀𝙍𝙀𝘿 𝘽𝙔 𝘿𝘼𝙍𝙆 𝙎𝙔𝙎𝙏𝙀𝙈 ⚙️
┃ 💠 𝗡𝗘𝗢𝗡 𝗖𝗬𝗕𝗘𝗥 𝗠𝗢𝗗𝗘 𝗢𝗡 ⚔️
╚═══⚡『 𝗥𝗔𝗛𝗠𝗔𝗡-𝗠𝗗 』⚡═══╝`;

    const finalCaption = `${caption || "🎬 TikTok Video"}\n\n${stylishBox}`;

    await conn.sendMessage(from, {
      video: Buffer.from(buffer.data),
      caption: finalCaption,
      mimetype: "video/mp4"
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    reply("❌ Error downloading video!");
  }
});