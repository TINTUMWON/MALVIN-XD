const config = require('../settings');
const { malvin } = require('../malvin');
const axios = require('axios');

malvin({
  on: "body"
}, async (conn, m, { isGroup }) => {
  try {
    if (config.MENTION_REPLY !== 'true' || !isGroup) return;
    if (!m.mentionedJid || m.mentionedJid.length === 0) return;

    const voiceClips = [
      "https://files.catbox.moe/2qzq0k.mp4",
      "https://files.catbox.moe/sw9fda.mp4",
      "https://files.catbox.moe/yr0xsy.mp4",
      "https://files.catbox.moe/eplzyd.mp4",
      "https://files.catbox.moe/duaywa.mp4",
      "https://files.catbox.moe/0qm9jk.mp4",
      "https://files.catbox.moe/p50q41.mp4",
      "https://files.catbox.moe/qxfeiv.mp4",
      "https://files.catbox.moe/at16p4.mp4",
      "https://files.catbox.moe/unvj6y.mp4"
    ];

    const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];
    const botNumber = conn.user.id.split(":")[0] + '@s.whatsapp.net';

    if (m.mentionedJid.includes(botNumber)) {
      const thumbnailRes = await axios.get(config.MENU_IMAGE_URL || "https://files.catbox.moe/mn47ve", {
        responseType: 'arraybuffer'
      });
      const thumbnailBuffer = Buffer.from(thumbnailRes.data, 'binary');

      await conn.sendMessage(m.chat, {
        audio: { url: randomClip },
        mimetype: 'audio/mp4',
        ptt: true,
        waveform: [99, 0, 99, 0, 99],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: config.BOT_NAME || "ɢᴏᴊᴏ-XD",
            body: config.DESCRIPTION || "POWERED BY ᴍɪᴅʟᴀᴊ",
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: thumbnailBuffer,
            mediaUrl: "https://files.catbox.moe/nw1i6h.jpg", // Static image URL
            sourceUrl: "https://wa.me/919961492108",
            showAdAttribution: true
          }
        }
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    const ownerJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    await conn.sendMessage(ownerJid, {
      text: `* Error in Mention Handler:*\n${e.message}`
    });
  }
});
