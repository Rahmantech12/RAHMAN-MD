const path = require("path");
const { File } = require("megajs");
const { cmd } = require('../command');

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

cmd({
    pattern: "mega",
    alias: ["mg"],
    react: "⬇️",
    desc: "Download files from MEGA",
    category: "download",
    use: ".mega <mega-url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(`*𝙿𝚕𝚎𝚊𝚜𝚎 𝚜𝚎𝚗𝚍 𝚊 𝙼𝙴𝙶𝙰 𝚕𝚒𝚗𝚔 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚝𝚑𝚎 𝚏𝚒𝚕𝚎.*`)
        }

        await reply("𝑹𝒂𝒉𝒎𝒂𝒏-𝒎𝒅 𝒖𝒑𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒇𝒊𝒍𝒆..⬇️")

        const file = File.fromURL(q)
        await file.loadAttributes()
        
        let maxSize = 300 * 1024 * 1024;
        if (file.size >= maxSize) {
            return reply(`𝚃𝚑𝚎 𝚏𝚒𝚕𝚎 𝚒𝚜 𝚝𝚘𝚘 𝚑𝚎𝚊𝚟𝚢 (𝙼𝚊𝚡𝚒𝚖𝚞𝚖 𝚠𝚎𝚒𝚐𝚑𝚝: 300𝙼𝙱).`)
        }
        
        let cap = `‎‎╭━━━〔 *ᴍᴇɢᴀ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ* 〕━━╮
‎┃ 💾 *ɴᴀᴍᴇ : ${file.name}*
‎┃ 📦 *sɪᴢᴇ : ${formatBytes(file.size)}*
‎┃ 🌐 *ᴜʀʟ : ${q}*
‎╰━━━━━━━━━━━━━━━━━━━━╯
            *_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴍᴅ_*`
        
        await reply(cap)

        const data = await file.downloadBuffer()
        const fileExtension = path.extname(file.name).toLowerCase()
        const mimeTypes = {
            ".mp4": "video/mp4",
            ".pdf": "application/pdf",
            ".zip": "application/zip",
            ".rar": "application/x-rar-compressed",
            ".7z": "application/x-7z-compressed",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
        }
        
        let mimetype = mimeTypes[fileExtension] || "application/octet-stream"
        
        // Send file based on type
        if (mimetype.startsWith('video/')) {
            await conn.sendMessage(from, {
                video: data,
                caption: file.name,
                fileName: file.name,
                mimetype: mimetype
            }, { quoted: m })
        } else if (mimetype.startsWith('image/')) {
            await conn.sendMessage(from, {
                image: data,
                caption: file.name,
                fileName: file.name,
                mimetype: mimetype
            }, { quoted: m })
        } else {
            await conn.sendMessage(from, {
                document: data,
                fileName: file.name,
                mimetype: mimetype
            }, { quoted: m })
        }

    } catch (e) {
        console.error('MEGA Download Error:', e)
        reply(`⚠️ A problem has occurred.\n\n${e.message}`)
    }
})
