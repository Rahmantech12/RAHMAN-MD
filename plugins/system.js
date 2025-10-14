const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os")
const {runtime} = require('../lib/functions')
cmd({
    pattern: "system",
    react: "💻",
    alias: ["uptime2" ,"runtime2"],
    desc: "cheack uptime",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let status = `‎*╭┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⍟*
‎*┋*🚀 *_Rαнмαη-м∂ Rυηηιηg sιηcє_* 
‎*┋*
‎*┋*⏱️ *_υρтιмє:➠ ${runtime(process.uptime())}_* 
‎*┋*
‎*┋🧑‍💻* *_σωηєʀ:➠_* *_Rαнмαη τєϲн_* 
‎*╰┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━┈⍟*
`
await conn.sendMessage(from,{image:{url:config.ALIVE_IMG},caption:`${status}`},{quoted:mek})

}catch(e){
console.log(e)
reply(`${e}`)
}
})
