const fs = require('fs');
const path = require('path');
const { getConfig } = require("./lib/configdb");

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    // ===== BOT CORE SETTINGS =====
    SESSION_ID: process.env.SESSION_ID || "RAHMAN-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0xvMUNkQTRRZjM3VVBOb1B4ajFCL1UrUDZrSkxYS0hYekVXS25WK1ZWbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU3NyOWJxdzlYcUlFK0gwVGFaZ1dSZzI3bGhqcm15RFlWbzVrWDZiZEd6QT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJNT0lzNExhUktrRWdFelg1UUc0bmVyT0RoSUJkV2hqbXhGdGNnRjNLOTFVPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4Q0x0NmNLdWNkSEZzcXBQcFZTRjJ0SU1yTXNXcXRiWU1YMzBCN0FveVg0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFJRm9DUzlpUlFQVUh4SEF6NHpXRkNUc3JRc2x3VXBVeVNZTlIva3ZBMEk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdBanRFVDJUOTFiajZOZmNQL202bXNqYzM3T0tRelN2NXFvRGpWczJDWDA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0VaQkhiQnBpbW41S2E0clMzUjY5bHU1a0J4VGs3UjRtT2tRSXpmb0FFND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidTVLVmxGbHpqYjJ5VFJvdFhhUDB3YzZITlhDWnlBeGtnbGp1Q2RQRFYzRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InZwTzVMUXliMFFzWXA0eGxrT3JTaFc0QmYycWgraVRpbDNEbk1Hd1hVcUlRUENHOHZHQ2xneWZ1WmdCQmIxcHZXekdBMElSc2IwYXFWN2Z2TnNDZ0JRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjE5LCJhZHZTZWNyZXRLZXkiOiIyRUJjM0ZpS1pYOWd1K1hZYm5INmE4bkNVa1dzdVJhQzlYYVY1RkVnVVNVPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjkyMzA5ODk2NzI1M0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQ0Y1RkRGQTNBMDdERDRDQzQxNDJGRjU4MjIzOEYxQyJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzU5NjA1NzM3fSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMwOTg5NjcyNTNAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUM3RDEzMEM5QkM0MTZGQ0VEOTcwQkFBQjNBRDI4N0MifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1OTYwNTczN31dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiQlBMTUFSUFoiLCJtZSI6eyJpZCI6IjkyMzA5ODk2NzI1MzoxNUBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjE1NjEzOTc2MTIzMDA3MDoxNUBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0xmaWlLY0hFT0huaGNjR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkU3anJUSFBZUWFpNTdNMzJZYmdFSHVHUkdackRpYlBFcVdpS2lRQi9SMEE9IiwiYWNjb3VudFNpZ25hdHVyZSI6ImphV1ZrTGpLTCtqNk1tRGorSjJIUDVDVWt1aWIvMVcvWjhDQU4raDJxVEFJTlRoR240SFQzaUpkTml1bzdxRGVaZmNKMUowaStmMlFlQ2JqYVZzNURnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJIRUJCSHh5SUp4L0FMdkZCTzBrWGVuckNpVk1oUXFicVNsdHY0c2FFRC9DNFJ3RFhOZVRXaUZLd3pGWEhsZW1jNHE4STdSNmc2QTBjKzcycjlLcUZBdz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzA5ODk2NzI1MzoxNUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJSTzQ2MHh6MkVHb3Vlek45bUc0QkI3aGtSbWF3NG16eEtsb2lva0FmMGRBIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQWdJRFE9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NTk2MDU3MzQsImxhc3RQcm9wSGFzaCI6IjJWNzdxVSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSFRYIn0=",  // Your bot's session ID (keep it secure)
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
        
