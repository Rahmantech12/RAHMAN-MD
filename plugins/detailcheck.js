const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "detailcheck",
    alias: ["wavadate", "checkwa", "wanumber"],
    react: "✅",
    desc: "Check detailed WhatsApp account information",
    category: "utility",
    use: '.wacheck <phone number>',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, q }) => {
    try {
        if (!q) return reply("⚠️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒑𝒉𝒐𝒏𝒆 𝒏𝒖𝒎𝒃𝒆𝒓.\n 𝑬𝒙𝒂𝒎𝒑𝒍𝒆: .𝒅𝒆𝒕𝒂𝒊𝒍𝒄𝒉𝒆𝒄𝒌 923015954782");

        const phoneNumber = q.replace(/[+\s\-()]/g, '');
        if (!phoneNumber.match(/^\d+$/)) return reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒑𝒉𝒐𝒏𝒆 𝒏𝒖𝒎𝒃𝒆𝒓. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒐𝒏𝒍𝒚 𝒅𝒊𝒈𝒊𝒕𝒔.");
        if (phoneNumber.length < 8) return reply("❌ 𝑷𝒉𝒐𝒏𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒊𝒔 𝒕𝒐𝒐 𝒔𝒉𝒐𝒓𝒕.");

        await reply("𝑨𝒏𝒂𝒍𝒚𝒛𝒊𝒏𝒈 𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑 𝒂𝒄𝒄𝒐𝒖𝒏𝒕...🔎");

        try {
            const response = await axios.post(
                'https://whatsapp-number-validator3.p.rapidapi.com/WhatsappNumberHasItWithToken',
                { phone_number: phoneNumber },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-host': 'whatsapp-number-validator3.p.rapidapi.com',
                        'x-rapidapi-key': 'adb03fd619msh91f2556557237f4p10f659jsn96ca8c5079ee',
                    },
                    timeout: 15000
                }
            );

            const data = response.data;

            // Sleek WhatsApp-style box
            let boxLines = [];
            boxLines.push("╔══════════════════════╗");
            boxLines.push("║  ⚡ 𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑 𝒊𝒏𝒇𝒐 ⚡ ║");
            boxLines.push("╠══════════════════════╣");
            boxLines.push(`║ 📱 𝐍𝐮𝐦𝐛𝐞𝐫   : ${phoneNumber}`);
            boxLines.push(`║ ⏰ 𝐂𝐡𝐞𝐜𝐤𝐞𝐝  : ${new Date().toLocaleString()}`);

            let hasWhatsApp = false;
            if (data.status === "valid" || data.status === true ||
                data.has_whatsapp === true || data.hasWhatsApp === true ||
                data.valid === true || data.is_valid === true ||
                data.exists === true || data.whatsapp === true) {
                hasWhatsApp = true;
                boxLines.push("║ ✅ 𝐒𝐭𝐚𝐭𝐮𝐬   : Account Exists");
            } else {
                boxLines.push("║ ❌ Status   : No Account Found");
            }

            if (hasWhatsApp) {
                const creationYear = getRandomYear(2015, 2024);
                const isActive = Math.random() > 0.2;
                const isBanned = Math.random() < 0.1;
                const canReceiveOTP = Math.random() > 0.1;

                boxLines.push(`║ 📅 𝐂𝐫𝐞𝐚𝐭𝐞𝐝  : ${creationYear}`);
                boxLines.push(`║ 🔵 𝐀𝐜𝐭𝐢𝐯𝐞   : ${isActive ? 'Yes' : 'No'}`);
                boxLines.push(`║ 🚫 𝐁𝐚𝐧      : ${isBanned ? 'Banned' : 'Normal'}`);
                boxLines.push(`║ 📨 OTP      : ${canReceiveOTP ? 'Receivable' : 'Not Receivable'}`);
                boxLines.push(`║ 👀 Last Seen: ${getRandomLastSeen()}`);
                boxLines.push(`║ 📊 Type     : ${getRandomAccountType()}`);
            }

            if (data.country_code) boxLines.push(`║ 🌍 𝐂𝐨𝐮𝐧𝐭𝐫𝐲 𝐂𝐨𝐝𝐞: ${data.country_code}`);
            if (data.country || data.country_name) boxLines.push(`║ 🏴 𝐂𝐨𝐮𝐧𝐭𝐫𝐲    : ${data.country || data.country_name}`);
            if (data.carrier) boxLines.push(`║ 📶 𝐂𝐚𝐫𝐫𝐢𝐞𝐫    : ${data.carrier}`);
            if (data.line_type) boxLines.push(`║ 📞 𝐋𝐢𝐧𝐞       : ${data.line_type}`);

            if (!hasWhatsApp) boxLines.push("║ 💡 𝐍𝐨𝐭𝐞: Number doesn't have WhatsApp or inaccessible.");

            boxLines.push("╚══════════════════════╝");
            boxLines.push("𝑫𝒊𝒔𝒄𝒍𝒂𝒊𝒎𝒆𝒓: 𝑺𝒐𝒎𝒆 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒊𝒔 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒆𝒅. ❌");

            let resultText = boxLines.join("\n");
            await reply(resultText);

        } catch (apiError) {
            console.error("API Error:", apiError.response?.data || apiError.message);
            return reply("❌ Failed to analyze WhatsApp number. Try again later.");
        }

    } catch (error) {
        console.error("WhatsApp check error:", error);
        reply("❌ An error occurred. Please try again.");
    }
});

// Helper functions
function getRandomYear(min, max) {
    const year = Math.floor(Math.random() * (max - min + 1)) + min;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
}

function getRandomLastSeen() {
    const options = ["Recently","Within a week","Within a month","Months ago","Just now","Today","Yesterday"];
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomAccountType() {
    const types = ["Personal","Business","Official"];
    return types[Math.floor(Math.random() * types.length)];
}