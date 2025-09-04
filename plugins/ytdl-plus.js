const config = require('../config');
const { cmd } = require('../command');
const fetch = require("node-fetch");

// 🎬 YouTube MP4 Downloader
cmd({
  pattern: "songx",
  alias: ["ytmp4"],
  desc: "Download YouTube video (MP4)",
  category: "main",
  use: ".songx <YouTube URL>",
  react: "🔰",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("❗ Please provide a YouTube link.");

    // ⏳ Processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiKey = config.API_KEY || ""; // 🔑 Add your API key in config
    const url = `https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(q)}&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.status || !data.result?.url) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ No video found or API error.");
    }

    const video = data.result;

    await conn.sendMessage(from, {
      video: { url: video.url },
      mimetype: "video/mp4",
      caption: `📽️ *${video.title || "YouTube Video"}*\n⏳ ${video.duration || "-"}\n👁️ ${video.views || "-"} views`
    }, { quoted: mek });

    // ✅ Success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("⚠️ Error occurred. Try again.");
  }
});


// 🎵 YouTube MP3 Downloader
cmd({
  pattern: "play4",
  alias: ["ytmp3"],
  desc: "Download YouTube song (MP3)",
  category: "main",
  use: ".play4 <YouTube URL>",
  react: "🔰",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("❗ Please provide a YouTube link.");

    // ⏳ Processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiKey = config.API_KEY || ""; // 🔑 Add your API key in config
    const url = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(q)}&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.status || !data.result?.url) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ No audio found or API error.");
    }

    const song = data.result;

    await conn.sendMessage(from, {
      audio: { url: song.url },
      mimetype: "audio/mpeg",
      fileName: `${song.title || "YouTube Song"}.mp3`
    }, { quoted: mek });

    await reply(`🎵 *${song.title || "YouTube Song"}*\nDownloaded Successfully ✅`);

    // ✅ Success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("⚠️ Error occurred. Try again.");
  }
});
