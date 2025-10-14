/* 
   Created by RAHMAN TECH 👨‍💻
 
*/

const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "simdata",
    alias: ["sim"],
    desc: "Check SIM information using LegendXData API",
    category: "tools",
    react: "📡",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("📞 *Usage:* simdata <phone>\n\nExample:\n> simdata 923001234567");

        // Clean number
        let phone = q.replace(/\D/g, '');
        if (/^0\d{9,10}$/.test(phone)) phone = '92' + phone.slice(1);

        if (!/^\d{10,13}$/.test(phone)) 
            return reply("❌ Invalid number format.\nUse 92301xxxxxxx or 0301xxxxxxx.");

        const api = `https://legendxdata.site/Api/simdata.php?phone=${phone}`;
        const res = await axios.get(api, { timeout: 10000 });
        let data = res.data;

        if (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch {
                // keep as string if not JSON
            }
        }

        // ✨ Fancy Header + Data Formatting
        let caption = `╭──────────────◆\n│ *📡 SIM DATA LOOKUP*\n╰──────────────◆\n\n`;
        caption += `*📞 Number:* +${phone}\n\n`;

        if (data && typeof data === 'object') {
            for (const [key, value] of Object.entries(data)) {
                caption += `*${key.toUpperCase()}*: ${value}\n`;
            }
        } else {
            caption += typeof data === "string" ? data : "No data found.";
        }

        // 🏷️ Footer / Signature
        caption += `\n──────────────◆\n_© Rahman-MD`;

        await conn.sendMessage(from, { text: caption }, { quoted: m });

    } catch (e) {
        console.error(e);
        let errMsg = "❌ Error fetching SIM data.";
        if (e.code === "ECONNABORTED") errMsg += " (Request Timeout)";
        else if (e.response) errMsg += ` (Status ${e.response.status})`;
        reply(errMsg);
    }
});