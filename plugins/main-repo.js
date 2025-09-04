const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os")
const {runtime} = require('../lib/functions')
const axios = require('axios')
const {sleep} = require('../lib/functions')
const fs = require('fs')
const path = require('path')

cmd({
    pattern: "repo",
    alias: ["sc", "script", "repository"],
    desc: "Fetch information about a GitHub repository.",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/Rahmaullah97/RAHMAN-MD';

    try {
        // Extract username and repo name from the URL
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        // Fetch repository details using GitHub API with axios
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
        
        const repoData = response.data;

        // Format the repository information in new stylish format
        const formattedInfo = `
╭─〔 *𝐑𝐀𝐇𝐌𝐀𝐍-𝐌𝐃* 〕
│
├─ *📌 ʀᴇᴘᴏsɪᴛᴏʀʏ ɴᴀᴍᴇ:* ${repoData.name}
├─ *👑 ᴏᴡɴᴇʀ:* ʀᴀʜᴍᴀɴ ᴛᴇᴄʜ 
├─ *⭐ sᴛᴀʀᴛs:* ${repoData.stargazers_count}
├─ *⑂ ғᴏʀᴋs:* ${repoData.forks_count}
├─ *📝 ᴅᴇsᴄʀɪᴘᴛɪᴏɴ:* ${repoData.description || 'ʀᴀʜᴍᴀɴ ᴍᴅ ɪs ᴀ ᴄᴏᴏʟ ᴍᴜʟᴛɪ-ᴅᴇᴠɪᴄᴇ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ.'}
│
├─ *🔗 ɢɪᴛʜᴜʙ ʟɪɴᴋ:*
│   ${repoData.html_url}
│
├─ *🌐 ᴊᴏɪɴ ᴄʜᴀɴɴᴇʟ:*
│   https://whatsapp.com/channel/0029VaEV2x85kg7Eid9iK43R
│
╰┈─➤*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴛᴇᴄʜ*
`.trim();

        // Send an image with the formatted info as a caption
        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/84jssf.jpg` }, // Replace with your image URL
            caption: formattedInfo,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363201214007503@newsletter',
                    newsletterName: '‎𝐑𝐀𝐇𝐌𝐀𝐍-𝐓𝐄𝐂𝐇',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send audio voice message after sending repo info
        const audioPath = path.join(__dirname, '../assets/menux.m4a');
        
        if (fs.existsSync(audioPath)) {
            await conn.sendMessage(from, {
                audio: { url: audioPath },
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: mek });
        } else {
            console.error("Audio file not found at path:", audioPath);
        }

    } catch (error) {
        console.error("Error in repo command:", error);
        reply("❌ Sorry, something went wrong while fetching the repository information. Please try again later.");
    }
});
