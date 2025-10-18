const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "video",
    alias: ["ytmp4"],
    desc: "Download YouTube videos",
    category: "download",
    react: "🎥",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("📽️ *Please provide a video name or YouTube URL!*\n\nExample: `.video Madine Wale`");

        // ✅ YouTube search if query is not a link
        let url = q;
        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            const search = await yts(q);
            if (!search.videos || search.videos.length === 0) return await reply("❌ No results found!");
            url = search.videos[0].url;
        }

        // ✅ API URL (replace APIKEY with your valid key if needed)
        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(api);

        if (!data?.status || !data?.result?.media) {
            return await reply("❌ Download failed! Try again later.");
        }

        const media = data.result.media;
        const videoUrl = media.video_url_hd && media.video_url_hd !== "No HD video URL available"
            ? media.video_url_hd
            : media.video_url_sd && media.video_url_sd !== "No SD video URL available"
                ? media.video_url_sd
                : null;

        if (!videoUrl) return await reply("❌ No downloadable video found!");

        // ✅ Sending video with caption
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: `‎*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⍟*
‎*┋* 🎬 *${media.title}*
‎*┋┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━•⟢*
‎*┋* ✨ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴍᴅ*
‎*╰┉┉┉┉◉◉◉┉┉┉┉┉┉┉┉━┈┈⍟*`
        }, { quoted: mek });

        // ✅ Success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("❌ Error in video command:", e);
        await reply("⚠️ *An error occurred while downloading the video. Please try again later!*");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
