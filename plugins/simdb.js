/*
───────────────────────────────────────────────
📱 SIM DATABASE LOOKUP PLUGIN
✨ Created by Rahman Tech 💻
───────────────────────────────────────────────
*/

const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "sim",
    alias: ["simdata", "findsim"],
    desc: "Find SIM details by number",
    category: "tools",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { args }) => {
    try {
        const number = args.join(" ");
        if (!number) return m.reply("📞 *Please provide a phone number.*\n\nExample: .sim 03001234567");

        // ✅ Updated API link
        const url = `https://fam-official.serv00.net/api/database.php?number=${number}`;
        const { data } = await axios.get(url);

        if (data.status === "success" && Array.isArray(data.data) && data.data.length > 0) {
            const user = data.data[0];
            let msg = `
╭━━━〔 𝙎𝙄𝙈 𝘿𝘼𝙏𝘼 𝙁𝙊𝙐𝙉𝘿 〕━━━╮
│📞 *Mobile:* ${user.Mobile || "Not found"}
│👤 *Name:* ${user.Name || "Not found"}
│🆔 *CNIC:* ${user.CNIC || "Not found"}
│📍 *Address:* ${user.Address || "Not found"}
│📶 *Operator:* ${user.Operator || "Not found"}
╰━━━━━━━━━━━━━━━━━━━━━━━╯

✨ *Powered by ʀᴀʜᴍᴀɴ ᴛᴇᴄʜ*
`;

            await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
        } else {
            await conn.sendMessage(m.chat, { text: "⚠️ *No data found for this number.*" }, { quoted: mek });
        }
    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { text: "❌ Error fetching SIM data. Try again later." }, { quoted: mek });
    }
});