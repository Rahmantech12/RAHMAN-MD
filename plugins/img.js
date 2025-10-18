const axios = require('axios');
const config = require('../config');
const { cmd } = require('../command');

function getGoogleImageSearch(query) {
    const apis = [
        `https://api.delirius.xyz/search/gimage?query=${encodeURIComponent(query)}`,
        `https://api.siputzx.my.id/api/images?query=${encodeURIComponent(query)}`
    ];
    
    const getAll = async () => {
        for (const url of apis) {
            try {
                const res = await axios.get(url);
                const data = res.data;
                if (Array.isArray(data?.data)) {
                    const urls = data.data
                        .map(d => d.url)
                        .filter(u => typeof u === 'string' && u.startsWith('http'));
                    if (urls.length) return urls;
                }
            } catch (e) {
                // Ignore and try next API
            }
        }
        return [];
    };

    const getRandom = async () => {
        const all = await getAll();
        return all[Math.floor(Math.random() * all.length)] || null;
    };

    return { getAll, getRandom };
}

cmd({
    pattern: "imagen",
    alias: ["image", "img"],
    react: "🖼️",
    desc: "Search for images",
    category: "search",
    use: ".imagen <query>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`❀ Pɭɘʌsɘ ɘŋtɘʀ ʌ tɘxt to sɘʌʀcʜ ʆoʀ ʌŋ Iɱʌʛɘ.`);

        await reply("*‎Wʌɩt I'ɱ sɘʌʀcʜɩŋʛ ƴoʋʀ Iɱʌʛɘ...*");

        const res = getGoogleImageSearch(q);
        const urls = await res.getAll();
        
        if (urls.length < 2) return reply('✧ Not enough images found for an album.');

        const medias = urls.slice(0, 10).map(url => ({ image: { url } }));
        const caption = `‎*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⍟*
‎*┋*        *_ɪᴍᴀɢᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ_* 
‎*┋┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━•⟢*
‎*┋*     *_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴍᴀɴ-ᴍᴅ_* 
‎*╰┉┉┉┉◉◉◉┉┉┉┉┉┉┉━┈┈⍟*`;

        // Send multiple images
        for (const media of medias) {
            await conn.sendMessage(from, media, { quoted: m });
        }

        await conn.sendMessage(from, { text: caption }, { quoted: m });

    } catch (error) {
        console.error('Image Search Error:', error);
        reply(`⚠️ A problem has occurred.\n\n${error.message}`);
    }
});
