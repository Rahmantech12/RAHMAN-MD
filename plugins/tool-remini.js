const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { cmd } = require("../command");
const FormData = require("form-data");

// Add your imgbb API key here (fallback)
const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY";

cmd({
  pattern: "remini",
  alias: ["enhance", "hd", "upscale"],
  react: "✨",
  desc: "Enhance photo quality using AI",
  category: "utility",
  use: ".remini [reply to image]",
  filename: __filename,
}, async (client, message, { reply, quoted }) => {
  try {
    const quotedMsg = quoted || message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || "";

    if (!mimeType || !mimeType.startsWith("image/")) {
      return reply("❌ Please reply to a valid image file (JPEG/PNG).");
    }

    // Download image
    const mediaBuffer = await quotedMsg.download();

    // Detect extension
    let extension = "";
    if (mimeType.includes("image/jpeg")) extension = ".jpg";
    else if (mimeType.includes("image/png")) extension = ".png";
    else return reply("❌ Unsupported format. Use JPEG or PNG.");

    // Save temp file
    const tempFilePath = path.join(os.tmpdir(), `remini_input_${Date.now()}${extension}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    let imageUrl;

    // ====================
    // 1) Try tmpfiles.org
    // ====================
    try {
      const form = new FormData();
      form.append("file", fs.createReadStream(tempFilePath));

      const uploadResponse = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
        headers: form.getHeaders(),
      });

      if (uploadResponse.data?.data?.url) {
        imageUrl = uploadResponse.data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
        console.log("✅ Uploaded via tmpfiles:", imageUrl);
      }
    } catch (err) {
      console.warn("⚠️ tmpfiles upload failed, trying imgbb...", err.message);
    }

    // ====================
    // 2) Fallback: imgbb
    // ====================
    if (!imageUrl && IMGBB_API_KEY) {
      try {
        const formData = new FormData();
        formData.append("image", fs.createReadStream(tempFilePath));

        const imgbbResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
          headers: formData.getHeaders(),
        });

        if (imgbbResponse.data?.data?.url) {
          imageUrl = imgbbResponse.data.data.url;
          console.log("✅ Uploaded via imgbb:", imageUrl);
        }
      } catch (err) {
        console.warn("⚠️ imgbb upload failed:", err.message);
      }
    }

    // Cleanup temp file
    fs.unlinkSync(tempFilePath);

    if (!imageUrl) {
      throw new Error("❌ Failed to upload image (tmpfiles & imgbb both failed).");
    }

    // ====================
    // PrinceTechn API
    // ====================
    const apiUrl = `https://api.princetechn.com/api/tools/remini?apikey=prince&url=${encodeURIComponent(imageUrl)}`;

    await reply("🔄 Enhancing image quality, please wait...");
    const response = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      timeout: 60000,
    });

    if (!response.data || response.data.length < 100) {
      throw new Error("❌ API returned invalid image data.");
    }

    // Save enhanced image
    const outputPath = path.join(os.tmpdir(), `remini_output_${Date.now()}.jpg`);
    fs.writeFileSync(outputPath, response.data);

    // Send final result
    await client.sendMessage(
      message.chat,
      {
        image: fs.readFileSync(outputPath),
        caption: "✅ Image enhanced successfully!",
      },
      { quoted: message }
    );

    fs.unlinkSync(outputPath); // cleanup
  } catch (error) {
    console.error("Image Enhancement Error:", error);
    await reply(
      `❌ Error: ${error.message || "Failed to enhance image. The API might be down or the file is too large."}`
    );
  }
});
