const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "rtiktok",
  alias: ["rtt", "rtiktokdl"],
  desc: "🎵 Download TikTok video using TikWM API",
  category: "downloader",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("⚠️ Please provide a valid TikTok video link!");

    // Step 1: Notify user
    const wait = await reply("⏳ Fetching TikTok video, please wait...");

    // Step 2: Call TikWM API
    const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || data.code !== 0) {
      return reply("❌ Failed to fetch video. Please check the link or try again later.");
    }

    const videoData = data.data;

    // Step 3: Download URL from API response
    const videoUrl = videoData.play || videoData.playAddr || videoData.wmplay;
    const title = videoData.title || "TikTok Video";
    const author = videoData.author?.nickname || "Unknown";
    const music = videoData.music || null;

    if (!videoUrl) return reply("❌ No valid video URL found in the API response!");

    // Step 4: Send video
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `✨ *TIKTOK DOWNLOADER* ✨

🎬 *Title:* ${title}
👤 *Author:* ${author}
🎵 *Music:* ${music ? music : "N/A"}

───────────────
🔥 *Powered by Rahman-MD* 🔥`
    }, { quoted: mek });

    // Step 5: Delete "please wait" message
    await conn.sendMessage(from, { delete: wait.key });

  } catch (err) {
    console.error(err);
    reply("❌ Error while processing your request!\n\n" + err.message);
  }
});
