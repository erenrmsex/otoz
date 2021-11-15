const Discord = require("discord.js")
const lrows = new Discord.Client()
const ayarlar = require("./settings.json")
const chalk = require("chalk")
const fs = require("fs")
const moment = require("moment")
const db = require("quick.db")
const request = require("request")
const express = require("express")
const http = require("http")
const app = express()
const logs = require("discord-logs")
require("moment-duration-format")
logs(lrows)
require("./util/eventLoader")(lrows)
var prefix = ayarlar.prefix
const log = message => {
  console.log(`bot aktifleştirilmiştir.`);
};





lrows.gif = {
  kategoriler: ayarlar.kategoriler,
  log: ayarlar.giflog,
  sunucu: ayarlar.sunucuadı,
  rastgele: {
    PP: ayarlar.lrowsrandompp, 
    GIF: ayarlar.lrowsrandomgif 
  }
  
}





lrows.commands = new Discord.Collection();
lrows.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut ${props.help.name}.`);
    lrows.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      lrows.aliases.set(alias, props.help.name);
    });
  });
});

lrows.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      lrows.commands.delete(command);
      lrows.aliases.forEach((cmd, alias) => {
        if (cmd === command) lrows.aliases.delete(alias);
      });
      lrows.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        lrows.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

lrows.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      lrows.commands.delete(command);
      lrows.aliases.forEach((cmd, alias) => {
        if (cmd === command) lrows.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
lrows.on('message', async msg =>{

  let categories = lrows.gif.kategoriler
  
  if(msg.attachments.size == 0&&categories.includes(msg.channel.parentID)){
  
  if(msg.author.bot) return;
  
  msg.delete({timeout:500})

  msg.reply('Bu kanalda sadece pp/gif paylaşabilirsin!').then(m=>m.delete({timeout:2000}))

}
  if(msg.attachments.size > 0 && categories.includes(msg.channel.parentID)){

  db.add(`sayı.${msg.author.id}`,msg.attachments.size)
  let emojis = ['🎄','💸','🫒','🍹','🌙']
  var random = Math.floor(Math.random()*(emojis.length));
  let pp = 0
  let gif = 0
  msg.attachments.forEach(atch=>{
   if(atch.url.endsWith('.webp')||atch.url.endsWith('.png')||atch.url.endsWith('.jpeg')||atch.url.endsWith('.jpg')){
     db.add(`pp.${msg.author.id}`,1)
     pp = pp + 1
   }
    if(atch.url.endsWith('.gif')){
     db.add(`gif.${msg.author.id}`,1)
      gif = gif +1
    }
  })
  let mesaj = ``
  if(gif > 0 && pp === 0){
    mesaj = `${gif} gif`
  }
if(pp > 0 && gif === 0){
    mesaj = `${pp} pp`
  }
if(gif > 0 && pp > 0){
    mesaj = `${pp} pp, ${gif} gif`
  }
  lrows.channels.cache.get(lrows.gif.log).send(new Discord.MessageEmbed().setColor('RANDOM').setAuthor('GIFPARTY • LOG').setDescription(`${emojis[random]} \`•\` **${msg.author.tag}** (\`${msg.author.id}\`) shared picture on <#${msg.channel.id}> \n ${mesaj} shared.\n\n**Detailed Information**\nTotal, ${db.fetch(`sayı.${msg.author.id}`)||0} pp/gif shared.`))
}
})

lrows.on(`userUpdate`, (oldUser, newUser) => {

 

  let kişi = lrows.users.get(oldUser.id)

  let avatar = kişi.avatarURL

  let kanal = lrows.channels.find(ch => ch.id === 'Kanal ID')

 

  const emb = new Discord.RichEmbed()

  .setImage(avatar)

  .setFooter(`${kişi.tag}`)

  .setTimestamp()

  .setDescription(`Fotoğrafa gitmek için [tıkla](${kişi.avatarURL})!`)

  kanal.send(emb)

 

})

lrows.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;//
  if (message.author.id === ayarlar.allah) permlvl = 4;//
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;//

lrows.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

lrows.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

lrows.on("ready",()=>{
  let oynuyor = 
      ["ErenRMS"]
    
    setInterval(function() {

        var random = Math.floor(Math.random()*(oynuyor.length-0+1)+0);

        lrows.user.setActivity(oynuyor[random],{type:'PLAYING'});
        }, 2 * 2000);
  setTimeout(()=>{
    lrows.user.setStatus("idle");

  },2000)
})
lrows.on("userUpdate", async(eski, yeni) => {
  if(eski.avatarURL() === yeni.avatarURL()) return;
  let avatar = (yeni.avatarURL({dynamic:true,size:1024})).split("?")[0];
  if((avatar).endsWith(".gif")) {
    lrows.channels.cache.get(lrows.gif.rastgele.PP).send(new Discord.MessageEmbed().setColor('RANDOM').setFooter(`${yeni.tag}`).setImage(avatar));
  } else {
    lrows.channels.cache.get(lrows.gif.rastgele.GIF).send(new Discord.MessageEmbed().setColor('RANDOM').setFooter(`${yeni.tag}`).setImage(avatar));
  };
});
console.log('Bot Başarıyla Aktif Edildi')
lrows.login(ayarlar.token).catch(err=> console.error('Tokeni Yenileyip Tekrar Girin'));


lrows.on('userUpdate', (oldUser, newUser) => {
if(oldUser.avatarURL() !== newUser.avatarURL()) {

  lrows.guilds.cache.forEach(async guild => {
  if(guild.members.cache.get(newUser.id)) {
  
  const channeldata = await require('quick.db').fetch(`ppgif.${guild.id}`)
  if(!channeldata) return;
  let channel = await guild.channels.cache.get(channeldata)
  
  let avatar = new Discord.MessageAttachment(newUser.avatarURL())
  let gifkontrol;
  if(newUser.avatarURL().includes('.gif')) { gifkontrol = `**[GİF](${newUser.avatarURL()})**` }
  if(!newUser.avatarURL().includes('.gif')) { gifkontrol = `~~**[GİF](${newUser.avatarURL()})**~~` }
    
    
  const chimp2 = new Discord.MessageEmbed().setColor('GOLD').setAuthor(newUser.tag).setImage(newUser.avatarURL()).setDescription(`${gifkontrol} **[PNG](${newUser.avatarURL().replace('.gif', '.png').replace('.jpg', '.png').replace('.webp', '.png')})** **[JPG](${newUser.avatarURL().replace('.png', '.jpg').replace('.gif', '.jpg').replace('.webp', '.jpg')})** **[WEBP](${newUser.avatarURL().replace('.gif', '.webp').replace('.png', '.webp').replace('.jpg', '.webp')})**`)
  if(!newUser.avatarURL().includes('.gif')) return channel.send(chimp2)

  }
  })
}
})
async function RadioRepeater() {//hamzamertakbaba#3575
  let Channel = lrows.channels.cache.get("RADYO ÇALACAK KANAL ID");
  var streamURL = "http://fenomen.listenfenomen.com/fenomen/256/icecast.audio";
  if(!Channel) return;
   await Channel.leave();
   Channel.join().then(connection => {
    const dispatcher = connection.play(streamURL);
    dispatcher.setVolume(100/100) //Radyonun sesini ayarlarsınız. Değiştirmek isterseniz en soldakini değiştirin. Örnek olarak: dispatcher.setVolume(50/100)

});
};

lrows.on('ready', () => {//hamzamertakbaba#3575
  RadioRepeater()
  setInterval(RadioRepeater, Math.max(3600000))
  let Channel = lrows.channels.cache.get("906922150580076614")
  if(!Channel) return;
    var streamURL = "https://listen.powerapp.com.tr/powerrbhiphop/mpeg/icecast.audio?/;";
     
    
           Channel.join().then(connection => {
              const dispatcher = connection.play(streamURL);
              dispatcher.setVolume(100/100) //Radyonun sesini ayarlarsınız. Değiştirmek isterseniz en soldakini değiştirin. Örnek olarak: dispatcher.setVolume(50/100)
      
          });
  });
lrows.on('guildMemberRemove', member => {
  const channel = lrows.channels.cache.get('888481855656038460');// hangi kanala mesaj gönderecek
  channel.send(`${member} sunucudan çıkış sağladı. Yasaklanmasını istiyorsanız \`👍\` tepkisine tıklayın.`).then(sent => {
    sent.react('👍').then(() => sent.react('👎'));
    sent.awaitReactions((reaction, user) => member.guild.members.cache.get(user.id).hasPermission('BAN_MEMBERS') && !user.bot, { max: 1, time: 60000, errors: ['time' ]}).then(collected => {
      collected = collected.first();
      if(collected.emoji.name == '👍') {331
        member.guild.members.ban(member.user.id);
        sent.reactions.removeAll();
        return channel.send(`${member}, ${collected.users.cache.filter(a => a.id !== lrows.user.id).first()} tarafından yasaklandı.`);
      } else {
        sent.reactions.removeAll();
        return channel.send(`${member} için yasaklama işlemi iptal edildi.`);
      };
    });
  });
});
lrows.on('guildMemberAdd', member => {

  const charArray = genCharArray();
  
    const nickArray = [];
    member.displayName.split('').forEach(ch => {
      if(charArray.includes(ch)) return nickArray.push(ch);
    });
    var clearedNick = nickArray.join('').replace(/\s+/g, ' ').trim();

    try {
      member.setNickname(clearedNick);
    } catch(error) {
    };

  function genCharArray() {
      var a = ['ç', 'ğ', 'ş', 'İ', 'ı', 'ü', '!'], i = 'a'.charCodeAt(0), j = 'z'.charCodeAt(0);
      for (; i <= j; ++i) {
          a.push(String.fromCharCode(i));
      };
      return a;
  };

});