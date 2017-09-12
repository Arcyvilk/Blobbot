const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
var emojis = {};

const token = process.env.DISCORD_API_TOKEN;
bot.login(token);

bot.on('ready', () => {
    var data = Date.now();
    bot.user.setPresence({ game: { name: "blob!info -> DM", type: 0 } });
    console.log(`${data} - Blobbot reports for duty!`);

    fetchEmojis();
    setInterval(() => {
        fetchEmojis();            
    }, 60000);
});

bot.on('message', message => {
    var m = message.content;

    if (!message.author.bot) {
        for (name in emojis) {
            if (message.content.indexOf(`:${name}:`) != -1 && message.content.indexOf(`<:${name}:`) == -1) {
                m = m.replace(`:${name}:`, `<:${name}:${emojis[name]}>`);
            }
        }
        if (message.content !== m) {
            if (message.guild.me.hasPermission('CHANGE_NICKNAME')) {
                message.guild.me.setNickname(`${message.author.username} (Blobbot)`, 'For the case of Blobbot');
                message.channel.send(`${m}`);
                message.guild.me.setNickname('Blobbot', 'Back to old nickname');
            }
            else
                message.channel.send(`**${message.author.username}:** ${m}`);
            if (message.guild.me.hasPermission('MANAGE_MESSAGES'))
                message.delete(3000);
        }

        if (message.content == 'blob!info') {
            var toSend = 'I am an emote bot. After adding me to any server I gain access to this server\'s emotes globally. ' +
                'If you try to use those emotes in any other server, I will resend your message with the original emotes attached.\n\n' +
                'If I have necesary permissions,  I will also change my nickname to one similar to yours and remove your original message to not break the flow of conversation.\n\n' +
                'I update my list emotes every 60 seconds.\n\n' +
                '**Commands:** ``blob!info`` | ``blob!list``\n' +
                `**Number of emotes:** ${Object.keys(emojis).length}\n` +
                '**Webpage:** http://arcyvilk.com/blobbot/ \n' +
                '**Author:** <:vikkie:235038789444173825> \`\`Arcyvilk#5460\`\`';
            sendEmbed('Info about Blobbot', toSend, message.author);
            if (message.guild.me.hasPermission('MANAGE_MESSAGES'))
                message.delete(3000);
        }
        if (message.content == 'blob!list') {
            var list = [];
            var m = '';

            for (name in emojis)
                list.push(name);
            list.sort();

            for (i in list) {
                if (`${m}${list[i]} `.length >= 2000) {
                    sendEmbed(`List of emotes`, m, message.author);
                    m = '';
                }
                if (!list[i-1] || list[i].substring(0, 1) != list[i - 1].substring(0, 1))
                    m += `\n\`\`${list[i].substring(0, 1)}:\`\``;
                m += `${list[i]} `;
            }
            sendEmbed(`List of emotes`, m, message.author);
            if (message.guild.me.hasPermission('MANAGE_MESSAGES'))
                message.delete(3000);
        }
    }
});

function fetchEmojis() {
    var g = bot.guilds.array();
    var d = Date.now();

    for (i in g) {
        var e = g[i].emojis.array();
        for (j in e)
            emojis[e[j].name] = e[j].id;
    }
};

function sendEmbed(title, content, channel) {
    var embed = new Discord.RichEmbed()
        .setTitle(title)
        .setColor(`0xFDC000`)
        .setDescription(content);
    channel.send({embed});
};