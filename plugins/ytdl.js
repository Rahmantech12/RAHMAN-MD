const { cmd } = require("../command");
const fetch = require("node-fetch");
const yts = require("yt-search");

// 🎵 Play Command (David API)
cmd({
  pattern: "ply",
  alias: ["sng", "mp"],
  desc: "Download YouTube Audio",
  category: "downloader",
  react: "🎶",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("Please provide a YouTube link or search query.\nExample: .play madine wale");

    let url;
    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      url = q;
    } else {
      let search = await yts(q);
      if (!search || !search.videos || search.videos.length === 0) return reply("No results found.");
      url = search.videos[0].url;
    }

    // ✅ David API call
    let res = await fetch(`https://apis.davidcyriltech.my.id/api/play?query=${encodeURIComponent(url)}`);
    let data = await res.json();

    if (!data || !data.status) return reply("Failed to fetch audio from API.");

    // ✅ Flexible audio URL
    let audioUrl = data.result?.download_url || data.result?.url || data.result?.audio;

    if (!audioUrl) return reply("No audio found in API response.");

    await conn.sendMessage(
      from,
      {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${data.result?.title || "song"}.mp3`
      },
      { quoted: mek }
    );

  } catch (e) {
    reply("❌ Error while fetching audio.");
    console.log("Play Command Error:", e);
  }
});

‎// 📹 Video Command (GTech API)
‎cmd({
‎  pattern: "video",
‎  alias: ["vid", "ytv"],
‎  desc: "Download YouTube Video",
‎  category: "downloader",
‎  react: "🎥",
‎  filename: __filename
‎}, async (conn, mek, m, { from, q, reply }) => {
‎  try {
‎    if (!q) return reply("Please provide a YouTube link or search query.\nExample: .video Pasoori");
‎
‎    let url;
‎    if (q.includes("youtube.com") || q.includes("youtu.be")) {
‎      url = q;
‎    } else {
‎      let search = await yts(q);
‎      if (!search || !search.videos || search.videos.length === 0) return reply("No results found.");
‎      url = search.videos[0].url;
‎    }
‎
‎    // ✅ GTech API call
‎    let res = await fetch(`https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(url)}`);
‎    let data = await res.json();
‎
‎    if (!data || !data.status) return reply("Failed to fetch video from API.");
‎
‎    // ✅ Flexible video URL (HD or SD)
‎    let videoUrl = data.result?.media?.video_url_hd && data.result.media.video_url_hd !== "No HD video URL available"
‎      ? data.result.media.video_url_hd
‎      : data.result?.media?.video_url_sd;
‎
‎    if (!videoUrl) return reply("No downloadable video found.");
‎
‎    await conn.sendMessage(
‎      from,
‎      {
‎        video: { url: videoUrl },
‎        caption: `🎬 ${data.result?.title || "*_ʀᴀʜᴍᴀɴ-ᴍᴅ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ_*"}\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴛᴇᴄʜ_*`
‎      },
‎      { quoted: mek }
‎    );
‎
‎  } catch (e) {
‎    reply("❌ Error while fetching video.");
‎    console.log("Video Command Error:", e);
‎  }
‎});
