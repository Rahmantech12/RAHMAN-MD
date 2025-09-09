const axios = require("axios");
const { cmd } = require("../command");

// 📥 Facebook Downloader (Auto fallback with 3 APIs)
cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl", "fbvideo"],
  react: '📥',
  desc: "Download Facebook videos (DavidCyril + Nexoracle fallback)",
  category: "download",
  use: ".fb <Facebook video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const fbUrl = args[0];
    if (!fbUrl || !fbUrl.includes("facebook.com")) {
      return reply('❌ Please provide a valid Facebook video URL.\nExample: `.fb https://facebook.com/...`');
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let downloadLink;

    // 1️⃣ Try DavidCyril API
    try {
      const dcApi = `https://apis.davidcyriltech.my.id/download/fb?url=${encodeURIComponent(fbUrl)}`;
      const { data } = await axios.get(dcApi);
      if (data?.result?.hd || data?.result?.sd) {
        downloadLink = data.result.hd || data.result.sd;
      }
    } catch (e) {
      console.log("DavidCyril API failed, trying Nexoracle v1...");
    }

    // 2️⃣ If not found, try Nexoracle v1
    if (!downloadLink) {
      try {
        const nxApi1 = `https://api.nexoracle.com/downloader/facebook?apikey=58b3609c238b2b6bb6&url=${encodeURIComponent(fbUrl)}`;
        const { data } = await axios.get(nxApi1);
        if (data?.result?.[0]?.url) {
          downloadLink = data.result[0].url;
        }
      } catch (e) {
        console.log("Nexoracle v1 failed, trying v2...");
      }
    }

    // 3️⃣ If still not found, try Nexoracle v2
    if (!downloadLink) {
      try {
        const nxApi2 = `https://api.nexoracle.com/downloader/facebook2?apikey=58b3609c238b2b6bb6&url=${encodeURIComponent(fbUrl)}`;
        const { data } = await axios.get(nxApi2);
        if (data?.result?.[0]?.url) {
          downloadLink = data.result[0].url;
        }
      } catch (e) {
        console.log("Nexoracle v2 failed.");
      }
    }

    // ❌ If all fail
    if (!downloadLink) {
      return reply("❌ Unable to fetch the video from all APIs.");
    }

    // ✅ Send video
    await conn.sendMessage(from, {
      video: { url: downloadLink },
      caption: `*╭───────────────━┈⍟*
┋ *_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴍᴅ_*
*╰───────────────━┈⍟*`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    reply("❌ Error: Unable to download.");
  }
});
