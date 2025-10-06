const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "search",
  alias: ["bing", "find"],
  desc: "🔍 Search anything using Bing API",
  category: "tools",
  react: "🔎",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("⚠️ Please provide a search query.\n\nExample: *.search cats*");

    const api = `https://bing-search.apis-bj-devs.workers.dev/?search=${encodeURIComponent(q)}&limit=5`;
    const { data } = await axios.get(api);

    if (!data || !data.results || data.results.length === 0)
      return reply("❌ No results found for your query!");

    let caption = `
╭══════════════════════╮
      🔎 𝑩𝒊𝒏𝒈 𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕 ⚡
╰══════════════════════╯
`;

    data.results.forEach((item, index) => {
      caption += `
${index + 1}. *${item.title || "No Title"}*
${item.snippet || "No description"}
🔗 ${item.url || "No URL"}\n`;
    });

    caption += `
╭─────────────────────╮
  🔰 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑹𝒂𝒉𝒎𝒂𝒏-𝒎𝒅  💫
╰─────────────────────╯
`;

    await conn.sendMessage(from, { text: caption }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply("❌ Error: Something went wrong while fetching results!");
  }
});