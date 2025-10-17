const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

// Text to Music API configuration
const textToMusicAPI = {
    baseURL: "https://api.privatezia.biz.id/api/ai/texttomusic"
};

cmd({
    pattern: "aiaudio",
    alias: ["aisong", "ttm", "aimusic"],
    react: "🎵",
    desc: "Generate music from text prompt",
    category: "AI",
    use: ".music <prompt>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴛᴇxᴛ ᴘʀᴏᴍᴘᴛ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ ᴍᴜsɪᴄ!\nExᴀᴍᴘʟᴇ: .ᴍᴜsɪᴄ sᴀᴅ ᴘɪᴀɴᴏ ᴍᴇʟᴏᴅʏ 30 sᴇᴄᴏɴᴅs");

        // ⏳ React - processing
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        
        await reply("🎵 ʀαнмαη-м∂ gεηεяαтσя үσυя мυsιc...");

        // Generate music from text prompt
        const apiUrl = `${textToMusicAPI.baseURL}?prompt=${encodeURIComponent(q)}`;
        
        const res = await axios.get(apiUrl, {
            timeout: 60000, // Longer timeout for music generation
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'accept': '*/*'
            }
        });

        if (!res.data || !res.data.status || !res.data.result || !res.data.result.url) {
            return await reply("❌ Failed to generate music. Please try again with a different prompt.");
        }

        const musicData = res.data.result;

        // Send the generated music
        await conn.sendMessage(from, {
            audio: { url: musicData.url },
            mimetype: 'audio/mpeg',
            fileName: `generated_music_${Date.now()}.mp3`
        }, { quoted: mek });

        // ✅ React - success
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('[TEXT_TO_MUSIC] Command Error:', error?.message || error);
        await reply("❌ Music generation failed: " + (error?.message || 'Unknown error'));
    }
});
                          
