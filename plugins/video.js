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
        if (!q) return await reply("📽️ Please provide video name or URL!\n\nExᴀᴍᴘʟᴇ: ᴍᴀᴅɪɴᴇ ᴡᴀʟᴇ");

        // Search on YouTube if query is not a link
        let url = q;
        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            const { videos } = await yts(q);
            if (!videos || videos.length === 0) return await reply("❌ No results found!");
            url = videos[0].url;
        }

        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(url)}`;
        const res = await axios.get(api);
        const json = res.data;

        if (!json?.status || !json?.result?.media) {
            return await reply("❌ Download failed! Try again later.");
        }

        const media = json.result.media;
        const videoUrl = media.video_url_hd !== "No HD video URL available"
            ? media.video_url_hd
            : media.video_url_sd !== "No SD video URL available"
                ? media.video_url_sd
                : null;

        if (!videoUrl) return await reply("❌ No downloadable video found!");

        // Send video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `‎*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⍟*
‎*┋* *_${media.title}_* 
‎*┋┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━•⟢*
‎*┋*     *_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴍᴅ_* 
‎*╰┉┉┉┉◉◉◉┉┉┉┉┉┉┉┉━┈┈⍟*`
        }, { quoted: mek });

        // Success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .video:", e);
        await reply("❌ Error occurred, try again later!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
                
