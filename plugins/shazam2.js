const axios = require('axios');
const { cmd } = require('../command');
const fs = require('fs');
const FormData = require('form-data');

cmd({
    pattern: "shazam2",
    alias: ["findsong2", "musicid2"],
    desc: "Identify song from audio or voice note",
    category: "tools",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { reply, q, mime }) => {
    try {
        if (!m.quoted || !/audio/.test(m.quoted.mtype)) {
            return reply("🎧 *Reply to any audio/voice note using this command!*");
        }

        let media = await m.quoted.download();
        let form = new FormData();
        form.append("upload_file", media, { filename: "song.mp3" });

        let res = await axios.post("https://shazam-api.com/api/recognize", form, {
            headers: {
                ...form.getHeaders(),
                "apikey": "muNuqCGVvFPNrCYzZz5jpXpgvxr0JR5GMJCaSxK8QSmhBmajVRTlfL05M4A0rkqN"
            },
        });

        let data = res.data;
        if (!data || !data.track) return reply("❌ Song not found!");

        let song = data.track;
        let text = `🎵 *Song Identified!*\n\n` +
                   `🎶 *Title:* ${song.title || "Unknown"}\n` +
                   `👤 *Artist:* ${song.subtitle || "Unknown"}\n` +
                   `💽 *Album:* ${song.sections?.[0]?.metadata?.find(v => v.title === "Album")?.text || "Unknown"}\n` +
                   `🔗 *URL:* ${song.url || "N/A"}`;

        if (song.images && song.images.coverart) {
            await conn.sendMessage(m.chat, {
                image: { url: song.images.coverart },
                caption: text
            }, { quoted: m });
        } else {
            await reply(text);
        }

    } catch (e) {
        console.error(e);
        reply("❌ Error identifying song! Check console or API key.");
    }
});