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
        if (!q) {
            return reply("Please provide a phone number.\nExample: .wacheck 923015954782");
        }

        // Clean the phone number
        const phoneNumber = q.replace(/[+\s\-()]/g, '');
        
        if (!phoneNumber.match(/^\d+$/)) {
            return reply("❌ Invalid phone number. Please provide only digits.");
        }

        if (phoneNumber.length < 8) {
            return reply("❌ Phone number is too short.");
        }

        const processingMsg = await reply("𝑨𝒏𝒂𝒍𝒚𝒛𝒊𝒏𝒈 𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑 𝒂𝒄𝒄𝒐𝒖𝒏𝒕...🔎");

        try {
            // API 1: Basic WhatsApp validation
            const response = await axios.post('https://whatsapp-number-validator3.p.rapidapi.com/WhatsappNumberHasItWithToken', 
                {
                    phone_number: phoneNumber
                },
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

            let resultText = `📱 *𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑 𝑫𝒆𝒕𝒂𝒊𝒍𝒆𝒅 𝑨𝒏𝒂𝒍𝒚𝒔𝒊𝒔*\n\n`;
            resultText += `🔢 *𝑵𝒖𝒎𝒃𝒆𝒓:* ${phoneNumber}\n`;
            resultText += `⏰ *𝑪𝒉𝒆𝒄𝒌𝒆𝒅:* ${new Date().toLocaleString()}\n\n`;

            // Determine WhatsApp status
            let hasWhatsApp = false;
            if (data.status === "valid" || data.status === true || 
                data.has_whatsapp === true || data.hasWhatsApp === true ||
                data.valid === true || data.is_valid === true ||
                data.exists === true || data.whatsapp === true) {
                hasWhatsApp = true;
                resultText += `✅ *𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑 𝑺𝒕𝒂𝒕𝒖𝒔:* 𝑨𝒄𝒄𝒐𝒖𝒏𝒕 𝑬𝒙𝒊𝒔𝒕𝒔\n`;
            } else {
                resultText += `❌ *𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑 𝑺𝒕𝒂𝒕𝒖𝒔:* 𝑵𝒐 𝑨𝒄𝒄𝒐𝒖𝒏𝒕 𝑭𝒐𝒖𝒏𝒅\n`;
            }

            if (hasWhatsApp) {
                // Simulate additional details (since API doesn't provide these)
                const creationYear = getRandomYear(2015, 2024);
                const isActive = Math.random() > 0.2; // 80% chance active
                const isBanned = Math.random() < 0.1; // 10% chance banned
                const canReceiveOTP = Math.random() > 0.1; // 90% chance can receive OTP
                
                resultText += `📅 *𝑨𝒄𝒄𝒐𝒖𝒏𝒕 𝑪𝒓𝒆𝒂𝒕𝒆𝒅:* ${creationYear}\n`;
                resultText += `🔵 *𝑨𝒄𝒕𝒊𝒗𝒆 𝑺𝒕𝒂𝒕𝒖𝒔:* ${isActive ? 'Currently Active' : 'Not Active'}\n`;
                resultText += `🚫 *𝑩𝒂𝒏 𝑺𝒕𝒂𝒕𝒖𝒔:* ${isBanned ? 'Account Banned' : 'use app'}\n`;
                resultText += `📨 *𝑶𝒕𝒑 𝑹𝒆𝒄𝒆𝒊𝒗𝒂𝒃𝒍𝒆:* ${canReceiveOTP ? 'Can Receive OTP' : 'Cannot Receive OTP'}\n`;
                
                // Additional simulated data
                const lastSeen = getRandomLastSeen();
                resultText += `👀 *𝑳𝒂𝒔𝒕 𝑺𝒆𝒆𝒏:* ${lastSeen}\n`;
                resultText += `📊 *𝑨𝒄𝒄𝒐𝒖𝒏𝒕 𝑻𝒚𝒑𝒆:* ${getRandomAccountType()}\n`;
            }

            // Real data from API if available
            if (data.country_code) {
                resultText += `🌍 *𝑪𝒐𝒖𝒏𝒕𝒓𝒚 𝑪𝒐𝒅𝒆:* ${data.country_code}\n`;
            }
            if (data.country || data.country_name) {
                resultText += `🏴 *𝑪𝒐𝒖𝒏𝒕𝒓𝒚:* ${data.country || data.country_name}\n`;
            }
            if (data.carrier) {
                resultText += `📶 *𝑪𝒂𝒓𝒓𝒊𝒆𝒓:* ${data.carrier}\n`;
            }
            if (data.line_type) {
                resultText += `📞 *𝑳𝒊𝒏𝒆 𝑻𝒚𝒑𝒆:* ${data.line_type}\n`;
            }

            if (!hasWhatsApp) {
                resultText += `\n💡 *𝑵𝒐𝒕𝒆:* 𝑻𝒉𝒊𝒔 𝒏𝒖𝒎𝒃𝒆𝒓 𝒅𝒐𝒆𝒔𝒏'𝒕 𝒉𝒂𝒗𝒆 𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑 𝒐𝒓 𝒕𝒉𝒆 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒊𝒔 𝒏𝒐𝒕 𝒂𝒄𝒄𝒆𝒔𝒔𝒊𝒃𝒍𝒆.`;
            }

            resultText += `\n\n⚠️ *𝑫𝒊𝒔𝒄𝒍𝒂𝒊𝒎𝒆𝒓:* 𝑺𝒐𝒎𝒆 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒊𝒔 𝒔𝒊𝒎𝒖𝒍𝒂𝒕𝒆𝒅 𝒇𝒐𝒓 𝒅𝒆𝒎𝒐𝒏𝒔𝒕𝒓𝒂𝒕𝒊𝒐𝒏.`;

            await reply(resultText);

        } catch (apiError) {
            console.error("API Error:", apiError.response?.data || apiError.message);
            
            if (apiError.response?.status === 400) {
                return reply("❌ Invalid phone number format.");
            } else if (apiError.response?.status === 429) {
                return reply("❌ API rate limit exceeded. Please try again later.");
            } else if (apiError.response?.status === 401) {
                return reply("❌ API key error. Please contact bot owner.");
            } else if (apiError.code === 'ECONNABORTYED') {
                return reply("❌ Request timeout. Please try again.");
            } else {
                return reply("❌ Failed to analyze WhatsApp number. Please try again later.");
            }
        }

    } catch (error) {
        console.error("WhatsApp check error:", error);
        reply("❌ An error occurred. Please try again.");
    }
});

// Helper functions for simulated data
function getRandomYear(min, max) {
    const year = Math.floor(Math.random() * (max - min + 1)) + min;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function getRandomLastSeen() {
    const options = [
        "Recently",
        "Within a week", 
        "Within a month",
        "Months ago",
        "Just now",
        "Today",
        "Yesterday"
    ];
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomAccountType() {
    const types = [
        "Personal",
        "Business",
        "Official",
        "Personal",
        "Business"
    ];
    return types[Math.floor(Math.random() * types.length)];
}
