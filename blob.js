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
            if (message.content.indexOf(`:${name}:`) != -1) {
                m = m.replace(`:${name}:`, `<:${name}:${emojis[name]}>`);
            }
        }
        if (message.content !== m) {
            message.channel.send(`**${message.author.username}**: ${m}`);
            message.delete(3000);
        }

        if (message.content == 'blob!info') {
            var toSend = 'I am an emote bot. After adding me to any server I gain access to this server\'s emotes globally. ' +
                'If you try to use those emotes in any other server, I will resend your message with the original emotes attached.\n' +
                'I update my list emotes every 60 seconds.\n\n' +
                '**Commands:** ``blob!info`` | ``blob!list``\n' +
                `**Number of emotes:** ${Object.keys(emojis).length}\n` +
                '**Invite link:** https://discordapp.com/oauth2/authorize?client_id=356890709799862273&scope=bot&permissions=0x00042000'
            sendEmbed('Info about Blobbot', toSend, message.author);
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