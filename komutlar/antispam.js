const Discord = require('discord.js');
const ayarlar = require('../settings.json');
const db = require('quick.db')

const prefix = ayarlar.prefix;

exports.run = async (client, message, args) => {
  
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`**Bunu yapabilmek için gerekli yetkiye sahip değilsiniz!**`)
 
  
    if(!args[0]) return message.reply(`**Lütfen Aç/Kapat yazın!** \n> **Doğru Kullanım;** \`${prefix}antispam <aç/kapat>\``)

    if(args[0] === "aç") {
      message.reply("AntiSpam başarıyla açıldı!")
      db.set(`antispam_${message.guild.id}`, "acik")
      return;
    } else if(args[0] === "kapat") {
      message.reply("AntiSpam başarıyla kapatıldı!")
      db.delete(`antispam_${message.guild.id}`)
      return;
    }
    

      }
    

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['antis'],
    permLevel: 0
}

exports.help = {
    name: 'antispam',
    description: 'AntiSpam.',
    usage: 'antispam aç/kapat'
}