'use strict';

const { bmbtz } = require("../devbmb/bmbtz");
const axios = require("axios");

// Newsletter info
const newsletterInfo = {
  jid: "120363382023564830@newsletter",
  name: "𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛",
  serverId: 0x8f
};

// Config
const config = {
  ALIVE_IMAGE: "https://files.catbox.moe/wmi0ne.jpg",
  AUDIO_MESSAGE: "https://files.catbox.moe/m1wgdb.mp3",
  CHANNEL_LINK: "https://whatsapp.com/channel/0029VawO6hgF6sn7k3SuVU3z",
  NEWSLETTER_INFO: newsletterInfo,
  THUMBNAIL: "https://files.catbox.moe/wmi0ne.jpg"
};

/**
 * Send Alive/Test message
 */
async function sendAliveMessage(dest, zk, options, isTest = false) {
  const sender = options?.ms?.pushName || "Unknown Contact";
  const label = isTest ? "TEST" : "ALIVE";

  try {
    // preload resources
    await Promise.all([
      axios.head(config.ALIVE_IMAGE),
      axios.head(config.AUDIO_MESSAGE)
    ]);

    const caption = `*Always Active*\n\n*Contact: ${sender}*\n` +
      (isTest
        ? "🎙️ [Visit Channel](" + config.CHANNEL_LINK + ")"
        : "🙏 [Visit Channel](" + config.CHANNEL_LINK + ")");

    const title = `Message from: ${sender}\n${isTest ? "Queen-M is Active" : "Queen-M is Active"}`;

    const message = {
      image: { url: config.ALIVE_IMAGE },
      caption,
      audio: { url: config.AUDIO_MESSAGE, mimetype: "audio/mpeg", ptt: true },
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: config.NEWSLETTER_INFO,
        forwardingScore: -1,
        externalAdReply: {
          title,
          body: config.NEWSLETTER_INFO.name,
          thumbnailUrl: config.THUMBNAIL,
          sourceUrl: config.CHANNEL_LINK,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    };

    await zk.sendMessage(dest, message);
    console.log(`${label} message sent successfully to ${dest}`);
    return true;

  } catch (err) {
    console.error(`${label} command error:`, err.message);

    // fallback text only
    try {
      await zk.sendMessage(dest, {
        text: `⚠️ ${label} Notification ⚠️\n\n` +
          `Bot is active but media couldn't load\n` +
          `Contact: ${sender}\n` +
          `Channel: ${config.CHANNEL_LINK}`
      });
    } catch (fallbackErr) {
      console.error("Fallback message failed:", fallbackErr.message);
    }
    return false;
  }
}

// live command
bmbtz({
  nomCom: "live",
  reaction: "🪀",
  categorie: "General",
  desc: "Check if bot is running",
  nomFichier: __filename
}, async (dest, zk, options) => {
  await sendAliveMessage(dest, zk, options);
});

// Test command
bmbtz({
  nomCom: "bot",
  reaction: "🪀",
  categorie: "General",
  desc: "Test bot functionality",
  nomFichier: __filename
}, async (dest, zk, options) => {
  await sendAliveMessage(dest, zk, options, true);
});

console.log("Bot commands loaded successfully");
