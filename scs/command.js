const { bmbtz } = require(__dirname + "/../devbmb/bmbtz");
const moment = require("moment-timezone");
const s = require(__dirname + "/../settings");

// Command definition
const menuCommand = {
  nomCom: "command",
  categorie: "General"
};

bmbtz(menuCommand, async (dest, zk, options) => {
  let {
    ms,
    repondre,
    prefixe,
    nomAuteurMessage,
    mybotpic
  } = options;

  // Load all commands
  let { cm } = require(__dirname + "/../devbmb/bmbtz");
  let categorized = {};
  let mode = "public";

  if (s.MODE.toLowerCase() !== "yes") {
    mode = "private";
  }

  // Random ping (mock latency)
  const ping = Math.floor(Math.random() * 200) + 100;

  // Group commands by category
  cm.map((command) => {
    if (!categorized[command.categorie]) {
      categorized[command.categorie] = [];
    }
    categorized[command.categorie].push(command.nomCom);
  });

  // Set timezone
  moment.tz.setDefault("Africa/Dar_es_Salaam");

  // Greeting by time
  const hour = moment().hour();
  let greeting = "🌅 Good Morning my friend 🌄";
  if (hour >= 12 && hour < 18) {
    greeting = "🌄 Good afternoon! My friend! 🌿";
  } else if (hour >= 18 && hour < 22) {
    greeting = "🌇 Good evening! Hope you had a great day! 🌙";
  } else if (hour >= 22 || hour < 5) {
    greeting = "🌌 Good night, time to sleep";
  }

  const time = moment().format("HH:mm:ss");
  const date = moment().format("DD/MM/YYYY");

  // Header menu
  let menuText = `
╭━━〔 *𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛* 〕━━┈⊷
┃๏╭───────────
┃๏│▸ 𝗢𝘄𝗻𝗲𝗿 : ${s.OWNER_NAME}
┃๏│▸ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ ${s.PREFIXE} ] 
┃๏│▸ 𝗠𝗼𝗱𝗲 : *${mode}*
┃๏│▸ 𝗗𝗮𝘁𝗲  : *${date}* 
┃๏│▸ 𝗧𝗶𝗺𝗲  : *${time}* 
┃๏│▸ 𝗣𝗶𝗻𝗴  : *${ping}ms*
┃๏│▸ 𝗖𝗿𝗲𝗮𝘁𝗼𝗿 : Bmb-Tech
┃๏└───────────···▸
╰──────────────┈⊷
*${greeting}*`;

  // Add command categories
  let commandsList = "";
  for (const cat in categorized) {
    commandsList += `\n╭──「 *${cat}* 」──┈⊷ \n┃╭──────────\n`;
    for (const name of categorized[cat]) {
      commandsList += `┃│▸ *${name}*\n`;
    }
    commandsList += "┃╰────────┈⊷  \n╰────────────┈⊷\n";
  }
  commandsList += "> *Made By 𝙱.𝙼.𝙱-𝚃𝙴𝙲𝙷*";

  try {
    // Send menu text
    await zk.sendMessage(dest, {
      text: menuText + commandsList,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "Bmb-Tech",
          serverMessageId: -1
        },
        forwardingScore: 999,
        externalAdReply: {
          title: "Queen-M",
          body: "Next Generation",
          thumbnailUrl: "https://github.com/novaxmd/BMB-XMD-DATA/raw/refs/heads/main/bmb.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029VawO6hgF6sn7k3SuVU3z",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });

    // Random voice note (PTT)
    const audios = [
      "https://files.catbox.moe/m1wgdb.mp3",
      "https://files.catbox.moe/f85wbk.mp3",
      "https://files.catbox.moe/cpjbnl.mp3",
      "https://files.catbox.moe/a20efv.mp3",
      "https://files.catbox.moe/moctzu.mp3"
    ];
    const randomAudio = audios[Math.floor(Math.random() * audios.length)];

    await zk.sendMessage(dest, {
      audio: { url: randomAudio },
      mimetype: "audio/mpeg",
      ptt: true
    }, { quoted: ms });

  } catch (err) {
    console.error("Menu error:", err);
    repondre("❌ An error occurred while processing the menu command. Please try again later.");
  }
});
