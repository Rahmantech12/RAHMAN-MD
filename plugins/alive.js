const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');
const fs = require("fs");
const axios = require("axios");

cmd({
    pattern: "alive",
    alias: ["status", "live"],
    desc: "Check bot status with music 🎵",
    category: "main",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const totalCmds = commands.length;
        const uptime = () => {
            let sec = process.uptime();
            let h = Math.floor(sec / 3600);
            let m = Math.floor((sec % 3600) / 60);
            let s = Math.floor(sec % 60);
            return `${h}h ${m}m ${s}s`;
        };

        const status = `‎*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⍟*
‎*┋*🌹 *_ʜɪ ᴊᴀɴɪᴍᴀɴ ᴍᴇɪɴ ᴏɴʟɪɴᴇ ʜᴏ_* 
‎*┋┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━•⟢*
‎*┋*🌏 *ᴘʟᴀᴛғᴏʀᴍ:* ʜᴇʀᴏᴋᴜ
‎*┋*📦 *ᴍᴏᴅᴇ:* ${config.MODE || 'private'}
‎*┋*🧑‍💻 *ᴏᴡɴᴇʀ:* ${config.OWNER_NAME || 'Rαԋɱαɳ υʅʅαԋ'} 
‎*┋*📝 *ᴘʀᴇғɪx:* ${config.PREFIX || '.'}
‎*┋*📁 *ᴄᴏᴍᴍᴀɴᴅs:* ${totalCmds} 
‎*┋*⏱️ *ʀᴜɴᴛɪᴍᴇ:* ${uptime()}
‎*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⍟*`;

        // 🟢 Your music file link
        const musicUrl = "https://files.catbox.moe/bhplqf.mp3";

        // Download and save music temporarily
        const { data } = await axios.get(musicUrl, { responseType: "arraybuffer" });
        const musicPath = "./temp_alive_music.mp3";
        fs.writeFileSync(musicPath, data);

        // Send alive message
        await conn.sendMessage(from, { 
            text: status,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

        // Send music after alive message
        await conn.sendMessage(from, { 
            audio: fs.readFileSync(musicPath), 
            mimetype: 'audio/mpeg',
            ptt: false  // change to true if you want it as a voice note
        }, { quoted: mek });

        // Remove temp file
        fs.unlinkSync(musicPath);

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});