const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "aivideo",
    alias: ["soravideo", "text2video"],
    desc: "Generate video from text using Sora AI",
    category: "ai",
    react: "🎞️",
    filename: __filename
},
async(conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {
    try {
        // Extract prompt from command arguments or quoted message
        const input = q || (quoted && quoted.text) || '';

        if (!input) {
            return reply("❌ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴘʀᴏᴍᴘᴛ. ᴇxᴀᴍᴘʟᴇ: .ᴀɪᴠɪᴅᴇᴏ ᴀɴɪᴍᴇ ɢɪʀʟ ᴡɪᴛʜ sʜᴏʀᴛ ʙʟᴜᴇ ʜᴀɪʀ\nᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ ᴡɪᴛʜ ᴛᴇxᴛ.");
        }

        const apiUrl = `https://okatsu-rolezapiiz.vercel.app/ai/txt2video?text=${encodeURIComponent(input)}`;
        
        // Send waiting message
        const waitingMsg = await reply("‎ʀαнмαη-м∂ gεηεʀαтιηg үσυʀ vι∂εσ...⏳");

        const { data } = await axios.get(apiUrl, { 
            timeout: 60000, 
            headers: { 'user-agent': 'Mozilla/5.0' } 
        });

        const videoUrl = data?.videoUrl || data?.result || data?.data?.videoUrl;
        
        if (!videoUrl) {
            throw new Error('No video URL found in API response');
        }

        // Delete waiting message
        if (waitingMsg && waitingMsg.key) {
            try {
                await conn.sendMessage(from, { delete: waitingMsg.key });
            } catch (e) {
                console.log("Could not delete waiting message");
            }
        }

        // Send the generated video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `‎*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⍟*
‎*┋* *_ʀᴀʜᴍᴀɴ ᴀɪ ᴠɪᴅᴇᴏ ɢᴇɴᴇʀᴀᴛᴏʀ_* 
‎*┋┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━•⟢*
‎*┋*     *_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴍᴅ_* 
‎*╰┉┉┉┉◉◉◉┉┉┉┉┉┉┉┉━┈┈⍟*
‎`
        }, { quoted: m });

    } catch (error) {
        console.error("Sora command error:", error);
        
        let errorMessage = "❌ Failed to generate video. ";
        
        if (error.code === 'ECONNABORTED') {
            errorMessage += "Request timeout. The video generation is taking too long.";
        } else if (error.response?.status === 429) {
            errorMessage += "API rate limit exceeded. Please try again later.";
        } else if (error.message.includes('No video URL')) {
            errorMessage += "API returned no video. Please try a different prompt.";
        } else {
            errorMessage += "Please try again with a different prompt.";
        }
        
        await reply(errorMessage);
    }
});