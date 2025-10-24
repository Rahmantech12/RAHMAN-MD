
const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "video", // New command name
    alias: ["dramadl", "serial"],
    desc: "Download YouTube Drama episodes",
    category: "downloader",
    react: "🎭",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("> 📺 Please provide the name of the video you want!\n\nExample: .video madine wale ");

        await reply("‎🔍 *_ʀαнмαη-м∂ sεαʀcнιηg үσυʀ vι∂εσ..._*");

        // --- 1. Search on YouTube ---
        let url = q;
        let videoTitle = q; // Default title
        let thumbnailUrl = null; // To store the thumbnail URL

        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            const { videos } = await yts(q);
            if (!videos || videos.length === 0) return await reply("❌ No drama or video results found!");
            
            // Get data from the first result
            const firstResult = videos[0];
            url = firstResult.url;
            videoTitle = firstResult.title;
            thumbnailUrl = firstResult.thumbnail;
        }

        // --- 2. Send Initial Message (Title and Photo) ---
        if (thumbnailUrl) {
            await conn.sendMessage(from, {
                image: { url: thumbnailUrl },
                caption: `🎬 *${videoTitle}*`
            }, { quoted: mek });
        } else {
            // Fallback if no thumbnail is available
            await reply(`🎬 *${videoTitle}*`);
        }
        
        // --- 3. Call the Download API ---
        // NOTE: Replace 'APIKEY' with your actual API key
        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(url)}`;
        const res = await axios.get(api);
        const json = res.data;

        if (!json?.status || !json?.result?.media) {
            return await reply("❌ Download failed! Try again later. The API might be down.");
        }

        const media = json.result.media;
        const videoUrl = media.video_url_hd !== "No HD video URL available"
            ? media.video_url_hd
            : media.video_url_sd !== "No SD video URL available"
                ? media.video_url_sd
                : null;

        if (!videoUrl) return await reply("❌ No downloadable video found!");

        // --- 4. Send the Video ---
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `‎╭───────────────━┈⍟
‎┋ *_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴛᴇᴄʜ_* 
‎╰───────────────━┈⍟`
        }, { quoted: mek });

        // Success reaction on the original message
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .video:", e);
        await reply("❌ An error occurred during the video download. Please check the video name or try again later!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
