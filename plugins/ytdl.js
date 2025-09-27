const { cmd } = require("../command");
const fetch = require("node-fetch");
const yts = require("yt-search");

// 🎵 Play Command (Audio Download)
cmd({
  pattern: "ply",
  alias: ["sng", "mp32"],
  desc: "Download YouTube Audio",
  category: "downloader",
  react: "🎶",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q || q.trim() === "") {
      return reply("Please provide a YouTube link or search query.\nExample: .play madine wale");
    }

    const query = q.trim();
    let url;

    // Validate and extract YouTube URL
    if (query.includes("youtube.com") || query.includes("youtu.be")) {
      // Basic URL validation
      try {
        new URL(query);
        url = query;
      } catch (urlError) {
        return reply("Invalid YouTube URL provided.");
      }
    } else {
      // Search for video
      try {
        let search = await yts(query);
        if (!search || !search.videos || search.videos.length === 0) {
          return reply("No results found for your search.");
        }
        url = search.videos[0].url;
      } catch (searchError) {
        return reply("Error searching for videos. Please try again.");
      }
    }

    // Fetch audio data from API
    let res;
    try {
      res = await fetch(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(url)}`);
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
    } catch (fetchError) {
      return reply("Failed to connect to audio service. Please try again later.");
    }

    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      return reply("Invalid response from audio service.");
    }

    if (!data || data.status === false) {
      return reply("Failed to fetch audio. The service might be unavailable.");
    }

    // ✅ Universal audio URL checker with priority
    let audioUrl = 
      data.result?.media?.audio_url ||
      data.result?.media?.audio ||
      data.result?.download_url ||
      data.result?.audio ||
      data.result?.url ||
      data.audio_url ||
      data.url;

    if (!audioUrl) {
      console.log("API Response:", JSON.stringify(data, null, 2));
      return reply("No audio URL found in the response.");
    }

    // Validate audio URL format
    if (!audioUrl.startsWith('http')) {
      return reply("Invalid audio URL format received.");
    }

    // Send audio with timeout
    try {
      await conn.sendMessage(from, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        ptt: false
      }, { 
        quoted: mek,
        timeout: 30000 // 30 second timeout
      });
      
    } catch (sendError) {
      return reply("Failed to send audio. The file might be too large or corrupted.");
    }

  } catch (e) {
    console.error("Play command error:", e);
    reply("❌ An unexpected error occurred while processing your request.");
  }
});

// 🎬 Video Command (Video Download) - UPDATED WITH NEW API
cmd({
  pattern: "video",
  alias: ["mp4", "vid"],
  desc: "Download YouTube Video",
  category: "downloader",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q || q.trim() === "") {
      return reply("Please provide a YouTube link or search query.\nExample: .video madine wale");
    }

    const query = q.trim();
    let url;

    // Validate and extract YouTube URL
    if (query.includes("youtube.com") || query.includes("youtu.be")) {
      // Basic URL validation
      try {
        new URL(query);
        url = query;
      } catch (urlError) {
        return reply("Invalid YouTube URL provided.");
      }
    } else {
      // Search for video
      try {
        let search = await yts(query);
        if (!search || !search.videos || search.videos.length === 0) {
          return reply("No results found for your search.");
        }
        url = search.videos[0].url;
      } catch (searchError) {
        return reply("Error searching for videos. Please try again.");
      }
    }

    // Try the new API first, fallback to old API if it fails
    let data;
    let apiUsed = "new";

    // NEW API: https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=
    try {
      // Note: You need to replace 'APIKEY' with your actual API key
      const newApiUrl = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(url)}`;
      let res = await fetch(newApiUrl);
      
      if (res.ok) {
        data = await res.json();
        
        // Check if new API returned valid data
        if (data && data.status !== false && data.result) {
          console.log("✅ Using new API successfully");
        } else {
          throw new Error("New API returned invalid data");
        }
      } else {
        throw new Error(`New API returned ${res.status}`);
      }
    } catch (newApiError) {
      console.log("❌ New API failed, falling back to old API:", newApiError.message);
      apiUsed = "old";
      
      // Fallback to old API
      try {
        let res = await fetch(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(url)}`);
        if (!res.ok) {
          throw new Error(`Old API returned ${res.status}`);
        }
        data = await res.json();
      } catch (oldApiError) {
        return reply("Failed to connect to video services. Please try again later.");
      }
    }

    if (!data || data.status === false) {
      return reply("Failed to fetch video. The service might be unavailable.");
    }

    // ✅ Universal video URL checker with priority for both APIs
    let videoUrl;

    if (apiUsed === "new") {
      // New API response structure
      videoUrl = 
        data.result?.video_url ||
        data.result?.url ||
        data.result?.downloadUrl ||
        data.result?.video ||
        data.video_url ||
        data.url;
    } else {
      // Old API response structure
      videoUrl = 
        data.result?.media?.video_url ||
        data.result?.media?.video ||
        data.result?.video_url ||
        data.result?.video ||
        data.result?.download_url ||
        data.result?.url ||
        data.video_url ||
        data.url;
    }

    if (!videoUrl) {
      console.log("Video API Response:", JSON.stringify(data, null, 2));
      return reply("No video URL found in the response.");
    }

    // Validate video URL format
    if (!videoUrl.startsWith('http')) {
      return reply("Invalid video URL format received.");
    }

    // Get video info for caption
    let videoInfo;
    try {
      let search = await yts({ videoId: getVideoId(url) });
      videoInfo = search;
    } catch (infoError) {
      videoInfo = null;
    }

    const caption = videoInfo ? 
      `*${videoInfo.title}*\nDuration: ${videoInfo.duration}\nAPI: ${apiUsed === "new" ? "G-Tech" : "Backup"}` : 
      "YouTube Video";

    // Send video with timeout
    try {
      await conn.sendMessage(from, {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: caption,
        fileName: "video.mp4"
      }, { 
        quoted: mek,
        timeout: 60000 // 60 second timeout for videos
      });
      
    } catch (sendError) {
      return reply("Failed to send video. The file might be too large or corrupted.");
    }

  } catch (e) {
    console.error("Video command error:", e);
    reply("❌ An unexpected error occurred while processing your request.");
  }
});

// Helper function to extract video ID from YouTube URL
function getVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
        }
