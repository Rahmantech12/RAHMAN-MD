const fs = require('fs');
const path = require('path');
const { getConfig } = require("./lib/configdb");

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    // ===== BOT CORE SETTINGS =====
    SESSION_ID: process.env.SESSION_ID || "‎RAHMAN-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRVAyejZUL2hjZUhVQ0RiVzFRYTV0cVZGRTZYMnE5dC9pMytHQ2ZRRHFuaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia08wemV1VVRSQWdxcFZFaFh0Q016SE5ZUU1TZzlsWXllcFF2R1djYnp4RT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ5TEY2OGY4cXp6OVNLWm5hWFg1bTZBczJkb29xaFdEalB5bW45cDJ5U0ZFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJSN1ZBT3h4S0g0aGFhcEZBd2dVbDkvbkdEcXJxZGt3UzQwak9NdVBMYXpjPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFITitBeWhMVktqOG5JMUJsdTlWZXdZZ09QZW5vRVV4cytmdEZFbW9qMVk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkhYT01jRFZGakl0Sk80cmg4azdoQjFUV28rMUFyTVBBL0ZVQ2VjTWJpVVU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNFB5WXZDMk5mWTFlNHJIZkQxUzdaU0R1WHVKSTNoaktObHVlbFlReFNXMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT2VDdlliajVFdTh5eUZkcjVUblBQWjRKMDRBVmluVVJ5aXo1MFNvYitGND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Imd5M05oVkNsbUtDd2lnRHZGamcxQzZzWDlUOVJhM25uRW9yS2xoMVNqZ3M0aElLZmJPRFR5UzBGVEl6amhJVGdQTFF0alY1NHBuNVJzSENPN0Q1S0NBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NzUsImFkdlNlY3JldEtleSI6ImlFZjVPeWs3d3M3ZXFFMTVza082TnoxcU0vcUp0ZFVEVVp1WkJwclVFZ2s9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6Ik42ODcyRDZBIiwibWUiOnsiaWQiOiI5MjMwOTg5NjcyNTM6MzZAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIxNTYxMzk3NjEyMzAwNzA6MzZAbGlkIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNNWGlpS2NIRUpyejc4Y0dHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJFN2pyVEhQWVFhaTU3TTMyWWJnRUh1R1JHWnJEaWJQRXFXaUtpUUIvUjBBPSIsImFjY291bnRTaWduYXR1cmUiOiI0eXZxS0dSa3I0blFIcWxJcUJjb0w5dlk0Y2pIcHYzSFBWQ3llQVl0KzM4dDk3VWhXT1luR3hkaDlQbGRhejVWeGVIa3NibG8xcHREelNZRmdKQ2ZCQT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiUW14SDFmaDV3OWJqeWhZc1pMZG5GczY0YTF0SW1qdGl4YmJ4VXNhUTNHM1BTWkRJb3lqNFlZenluZWV5bk04VXZTQ0h0MHJPak04c0krMVNqeUp1QkE9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI5MjMwOTg5NjcyNTM6MzZAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUk80NjB4ejJFR291ZXpOOW1HNEJCN2hrUm1hdzRtenhLbG9pb2tBZjBkQSJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FnSUFnPT0ifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzYxMzQzOTEyLCJsYXN0UHJvcEhhc2giOiIyVjc3cVUiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUR3eiJ9",  // Your bot's session ID (keep it secure)
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
        
