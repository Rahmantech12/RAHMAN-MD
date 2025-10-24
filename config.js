const fs = require('fs');
const path = require('path');
const { getConfig } = require("./lib/configdb");

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    // ===== BOT CORE SETTINGS =====
    SESSION_ID: process.env.SESSION_ID || "‎RAHMAN-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0lBVnJUL0RqNHk4ZnB2bTIxU3dtTWl1bncwTk5jeEZiY05WRTVTcmlWRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUDc2OFQ3b2xhbk1VU2htTFk2dGgrOUc2NzFrOVkxMCtrUnd1RjhFQlZsWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4SUhYTHE3V3N4TVhwRDBZVUR4Ty9MVHlHdmJqbm5RVzRqV0tXUnJCL1hBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ6KzcyUWpYeHpjMDdublVnSVNwbE0vNVY1WHBHTThadnIxWEQ4VFlzTFFBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNOYWVRSkVlZFlXZWxHME53WVphT3VkeTFqYVpZcG1mUmZVMW5vMDZ3Rjg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlJpTC91V09FUU50WWJFWHhDaWE2KzRIWThuclJqVDNWQ3oxOTUxZFRDbUE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUUtUalJnQUE5NDJrT09VSzIvUGgyeWZhUEJYZjhaUGdpL09Ia25tbGpYOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0hjQ0p1aHJDTDV6LytVa3JlRThsb0NYVXRKMDNKSjNCMDFGZmtxOFFBND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im00RCtUTnVxNVpWQU4vMXlVTytjN1FWRThzMHdQM0J6RVpTNWpWWjU5SjJIbnc4QzNGWVh3VWtNckxHTXNMSldjNWZaSlNiVnV0MkdseVJqV090Qmh3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI4LCJhZHZTZWNyZXRLZXkiOiJjUkwzbk9lcGJiMmIvNENKTjEwMWp6dExqcTNVUHpHelorZzRRZDA3SHJvPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjkyMzA5ODk2NzI1M0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQzQ0RTQ0NTY0MkUyNTNEMTQ0RDM2OEIxOEMwQTVGNSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzYxMzQ1NTI5fSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMwOTg5NjcyNTNAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUNBQjg1RTFGMDUwRUFENzI1Q0MzRTA4NjRGM0M1MjUifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2MTM0NTUyOX1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiMTFQRDMyMU4iLCJtZSI6eyJpZCI6IjkyMzA5ODk2NzI1MzozN0BzLndoYXRzYXBwLm5ldCIsImxpZCI6IjE1NjEzOTc2MTIzMDA3MDozN0BsaWQiLCJuYW1lIjoiSW5ub1hlbnQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ01iaWlLY0hFT3IvNzhjR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkU3anJUSFBZUWFpNTdNMzJZYmdFSHVHUkdackRpYlBFcVdpS2lRQi9SMEE9IiwiYWNjb3VudFNpZ25hdHVyZSI6ImREYTF3T1kwVTQzWDN3TWN4czJwbnJ6QTVyUk9vWVF0S25tVVFtQko4TWRTaXBPNzJ3VVZtNUV0YkZGcHlWMi82RFZDWHhhZDFtSWdBWUNha2NjUEJnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiIrU0Nha1hiSVVzUm5hVFNtWWx3VHloNFpDVXRvaElDbUFMVldnaGx4aHZRQm9FVnIzUnpySmxsdGpGVytMZ0I1eEtCcm03WUp6UTVJcDFsQ0xhb1VqUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzA5ODk2NzI1MzozN0BzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJSTzQ2MHh6MkVHb3Vlek45bUc0QkI3aGtSbWF3NG16eEtsb2lva0FmMGRBIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQWdJQWc9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NjEzNDU1MjYsImxhc3RQcm9wSGFzaCI6IjJWNzdxVSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSDVqIn0=",  // Your bot's session ID (keep it secure)
    PREFIX: getConfig("PREFIX") || ".",  // Command prefix (e.g., "., / ! * - +")
    CHATBOT: getConfig("CHATBOT") || "on", // on/off chat bot 
    BOT_NAME: process.env.BOT_NAME || getConfig("BOT_NAME") || "𝐑𝐀𝐇𝐌𝐀𝐍-𝐌𝐃",  // Bot's display name
    MODE: getConfig("MODE") || process.env.MODE || "public",        // Bot mode: public/private/group/inbox
    REPO: process.env.REPO || "https://github.com/RAHMAN-TECH90/RAHMAN-MD",  // Bot's GitHub repo
    BAILEYS: process.env.BAILEYS || "@whiskeysockets/baileys",  // Bot's BAILEYS

    // ===== OWNER & DEVELOPER SETTINGS =====
    OWNER_NUMBER: process.env.OWNER_NUMBER || "923015954782",  // Owner's WhatsApp number
    OWNER_NAME: process.env.OWNER_NAME || getConfig("OWNER_NAME") || "‎Rαԋɱαɳ υʅʅαԋ",           // Owner's name
    DEV: process.env.DEV || "923015954782",                     // Developer's contact number
    DEVELOPER_NUMBER: '923015954782@s.whatsapp.net',            // Developer's WhatsApp ID

    // ===== AUTO-RESPONSE SETTINGS =====
    AUTO_REPLY: process.env.AUTO_REPLY || "false",              // Enable/disable auto-reply
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",// Reply to status updates?
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*ʀᴀʜᴍᴀɴ ᴍᴅ ᴠɪᴇᴡᴇᴅ ʏᴏᴜʀ sᴛᴀᴛᴜs 🤖*",  // Status reply message
    READ_MESSAGE: process.env.READ_MESSAGE || "false",          // Mark messages as read automatically?
    REJECT_MSG: process.env.REJECT_MSG || "*📞 ᴄαℓℓ ɴσт αℓℓσωє∂ ιɴ тнιѕ ɴᴜмвєʀ уσυ ∂σɴт нανє ᴘєʀмιѕѕισɴ 📵*",
    // ===== REACTION & STICKER SETTINGS =====
    AUTO_REACT: process.env.AUTO_REACT || "false",              // Auto-react to messages?
    OWNER_REACT: process.env.OWNER_REACT || "false",              // Auto-react to messages?
    CUSTOM_REACT: process.env.CUSTOM_REACT || "false",          // Use custom emoji reactions?
    CUSTOM_REACT_EMOJIS: getConfig("CUSTOM_REACT_EMOJIS") || process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",  // set custom reacts
    STICKER_NAME: process.env.STICKER_NAME || "𝐑𝐀𝐇𝐌𝐀𝐍-𝐌𝐃",     // Sticker pack name
    AUTO_STICKER: process.env.AUTO_STICKER || "false",          // Auto-send stickers?
    // ===== MEDIA & AUTOMATION =====
    AUTO_RECORDING: process.env.AUTO_RECORDING || "false",      // Auto-record voice notes?
    AUTO_TYPING: process.env.AUTO_TYPING || "false",            // Show typing indicator?
    MENTION_REPLY: process.env.MENTION_REPLY || "false",   // reply on mentioned message 
    MENU_IMAGE_URL: getConfig("MENU_IMAGE_URL") || "https://files.catbox.moe/84jssf.jpg",  // Bot's "alive" menu mention image

    // ===== SECURITY & ANTI-FEATURES =====
    ANTI_DELETE: process.env.ANTI_DELETE || "true", // true antidelete to recover deleted messages 
    ANTI_CALL: process.env.ANTI_CALL || "false", // enble to reject calls automatically 
    ANTI_BAD_WORD: process.env.ANTI_BAD_WORD || "false",    // Block bad words?
    ANTI_LINK: process.env.ANTI_LINK || "true",    // Block links in groups
    ANTI_VV: process.env.ANTI_VV || "true",   // Block view-once messages
    DELETE_LINKS: process.env.DELETE_LINKS || "false",          // Auto-delete links?
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "same", // inbox deleted messages (or 'same' to resend)
    ANTI_BOT: process.env.ANTI_BOT || "true",
    PM_BLOCKER: process.env.PM_BLOCKER || "true",

    // ===== BOT BEHAVIOR & APPEARANCE =====
    DESCRIPTION: process.env.DESCRIPTION || "*_© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴛᴇᴄʜ_*",  // Bot description
    PUBLIC_MODE: process.env.PUBLIC_MODE || "true",              // Allow public commands?
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",        // Show bot as always online?
    AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true", // React to status updates?
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true", // VIEW to status updates?
    AUTO_BIO: process.env.AUTO_BIO || "false", // ture to get auto bio 
    WELCOME: process.env.WELCOME || "false", // true to get welcome in groups 
    GOODBYE: process.env.GOODBYE || "false", // true to get goodbye in groups 
    ADMIN_ACTION: process.env.ADMIN_ACTION || "false", // true if want see admin activity 
};
        
