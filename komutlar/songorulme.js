const Discord = require("discord.js");
const database = require("quick.db");
const moment = require('moment');
moment.locale('tr');
require('moment-duration-format');

exports.run = (client, message, args) => {//hamzamertakbaba#1268

let Member = message.mentions.users.first()
if(!Member) return message.channel.send(`${message.author} Durumuna bakmak istediğin bir kullanıcıyı etiketlemelisin.`).then(m => m.delete({timeout: 10000}));
if(Member.bot) return message.channel.send(`${message.author} Maalesef botların son görülmesine bakma gibi süper özelliklerim yok. Ama kullanıcıların Discord'a giriş ve çıkış tarihlerini gösterebilirim.`).then(m => m.delete({timeout: 10000}));
if(Member.presence.status === "offline") {
const Embed = new Discord.MessageEmbed()
.setAuthor(Member.username, Member.displayAvatarURL({dynamic: true}))
.setColor("BLACK")
.setDescription(`Bu kullanıcı en son ${moment(database.fetch(`Member.${Member.id}`)).format('DD/MM/YYYY HH:mm:ss')} tarihinde Discord'a giriş yapıp, ${moment(database.fetch(`Member2.${Member.id}`)).format('DD/MM/YYYY HH:mm:ss')} tarihinde çıkış yaptı.`)
message.channel.send(Embed)
} else {
let Array = [];
if(Member.presence.status === "dnd") Array.push("#FF0000")
if(Member.presence.status === "idle") Array.push("GOLD")
if(Member.presence.status === "online") Array.push("GREEN")
const Embed = new Discord.MessageEmbed()
.setAuthor(Member.username, Member.displayAvatarURL({dynamic: true}))
.setColor(`${Array}`)
.setDescription(`Bu kullanıcı ${moment.duration(Date.now() - database.fetch(`Member.${Member.id}`)).format('d [gün] h [saat] m [dakika] s [saniye]')} süredir ${Member.presence.status.replace("dnd", "Rahatsız Etmeyin").replace("idle", "Boşta").replace("online", "Çevrimiçi")} modunda aktif.`)
message.channel.send(Embed)
};

};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'son-görülme'
};