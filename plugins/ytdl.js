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

// 📹 Video Command (GTech API)
cmd({
  pattern: "video",
  alias: ["vid", "ytv"],
  desc: "Download YouTube Video",
  category: "downloader",
  react: "🎥",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("Please provide a YouTube link or search query.\nExample: .video Pasoori");

    let url, videoInfo;

    // 🔹 Check if input is a YouTube link
    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      url = q;
      let search = await yts(url);
      videoInfo = search.videos[0];
    } else {
      // 🔹 Search YouTube if it's not a direct link
      let search = await yts(q);
      if (!search || !search.videos || search.videos.length === 0) return reply("No results found.");
      videoInfo = search.videos[0];
      url = videoInfo.url;
    }

    // 🔹 GTech API call to fetch video download URLs
    let res = await fetch(`https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(url)}`);
    let data = await res.json();

    if (!data || !data.status) return reply("Failed to fetch video from API.");

    // 🔹 Choose HD if available, otherwise SD
    let videoUrl = data.result?.media?.video_url_hd && data.result.media.video_url_hd !== "No HD video URL available"
      ? data.result.media.video_url_hd
      : data.result?.media?.video_url_sd;

    if (!videoUrl) return reply("No downloadable video found.");

    // 🔹 Time ago calculation
    let publishedDateStr = videoInfo?.date;
    let timeAgo = "Unknown time";
    if (publishedDateStr) {
      let publishedDate = moment(publishedDateStr, "YYYY-MM-DD");
      timeAgo = publishedDate.fromNow(); // e.g., "2 days ago"
    }

    // 🔹 Video duration
    let duration = videoInfo?.timestamp || "Unknown duration";

    // 🔹 Stylish box caption
    let caption = `
‎╭════════════════════╮
‎│ 🎬 𝑻𝒊𝒕𝒍𝒆 : ${data.result?.title || videoInfo?.title}
‎│ 🕒 𝑻𝒊𝒎𝒆 𝐀𝐠𝐨 : ${timeAgo}
‎│ ⏱️ 𝑫𝒖𝒓𝒂𝒕𝒊𝒐𝒏 : ${duration}
‎╰════════════════════╯
‎   ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉
‎            𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑹𝒂𝒉𝒎𝒂𝒏-𝒎𝒅
‎   ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉
`;

    // 🔹 Send video with caption
    await conn.sendMessage(
      from,
      { video: { url: videoUrl }, caption: caption },
      { quoted: mek }
    );

  } catch (e) {
    reply("❌ Error while fetching video.");
    console.log("Video Command Error:", e);
  }
});
